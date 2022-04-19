import * as fs from 'fs';
import { TaskFunction } from 'puppeteer-cluster/dist/Cluster';
import { Job } from '../../declarations';
import { writeFileSync } from '../../utils';
import { pageFunctions } from './pageFns';

export const getItem: TaskFunction<Job, void> = async ({ page, data }) => {
  const {
    listItem: { filePath: relativeFilePath, link },
    params: { listPage, detailPage },
  } = data;

  const filePath = `build/${relativeFilePath}`;
  if (fs.existsSync(filePath)) {
    console.log(`The file exists: ${filePath}, skip it`);
  } else {
    await page.goto(link);
    const detail = await page.evaluate(pageFunctions.getItem);
    writeFileSync(filePath, { detail, ...data });
    console.log(
      `The detail in ${detailPage.index} / ${detailPage.total} ` +
        `: ${listPage.index} / ${listPage.total} is fetched`
    );
  }
};
