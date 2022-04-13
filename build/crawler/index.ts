import {
  getList as getListOnListPage,
  pageFunctions as listPageFunctions,
} from "./listPage";
import { combineUrl } from "./cluster/utils";
import { ClusterSingleton } from "./cluster";

(async () => {
  const cluster = await ClusterSingleton.getInstance();

  cluster.queue(async ({ page }) => {
    const firstPageUrl = combineUrl(1);
    await page.goto(firstPageUrl, { waitUntil: "domcontentloaded" });

    const listTotal = await page.evaluate(listPageFunctions.getTotal);

    new Array(listTotal).forEach((_, index) => {
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
