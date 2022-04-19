import * as fs from 'fs';
import { TaskFunction } from 'puppeteer-cluster/dist/Cluster';
import { Job, ListItem } from '../../declarations';
import { getItem as getItemOnDetailPage } from '../detailPage';
import { combineUrl, readFileSync, writeFileSync } from '../../utils';
import { ClusterSingleton } from '../cluster';
import { pageFunctions } from './pageFns';

export const getList: TaskFunction<Job, void> = async ({
  page,
  data: { params },
}) => {
  const { listPage } = params;
  const cluster = await ClusterSingleton.getInstance();
  const cachePath = `build/output/list/list-${listPage.index}-${listPage.total}.json`;

  let list: ListItem[] = [];
  if (fs.existsSync(cachePath)) {
    console.log(`The cache file exists: ${cachePath}, skip it`);
    list = readFileSync<ListItem[]>(cachePath);
  } else {
    const pageUrl = combineUrl(listPage.index);
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
    list = await page.evaluate(pageFunctions.getList);
    console.log(`The list in ${listPage.index} / ${listPage.total} is fetched`);
    writeFileSync(cachePath, list);
  }

  list.forEach((listItem, index) => {
    const data = {
      listItem,
      params: {
        ...params,
        detailPage: {
          index: index + 1,
          total: list.length,
        },
      },
    };
    cluster.queue(data, getItemOnDetailPage);
  });
};
