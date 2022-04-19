import { getList as getListOnListPage } from './listPage';
import { pageFunctions as listPageFunctions } from './listPage/pageFns';
import { combineUrl } from '../utils';
import { ClusterSingleton } from './cluster';

(async () => {
  const cluster = await ClusterSingleton.getInstance();

  cluster.queue(async ({ page }) => {
    const firstPageUrl = combineUrl(1);
    await page.goto(firstPageUrl, { waitUntil: 'domcontentloaded' });

    const listTotal = await page.evaluate(listPageFunctions.getTotal);
    console.log(`The list total is ${listTotal}`);

    Array.from({ length: listTotal }).forEach((_, index) => {
      const data = {
        params: {
          listPage: {
            index: index + 1,
            total: listTotal,
          },
        },
      };
      cluster.queue(data, getListOnListPage);
    });
  });

  await cluster.idle();
  await cluster.close();
})();
