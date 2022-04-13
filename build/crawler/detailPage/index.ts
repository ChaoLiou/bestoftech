import * as fs from "fs";
import { TaskFunction } from "puppeteer-cluster/dist/Cluster";
import { Detail, Job } from "../cluster/declarations";
import { writeFileSync } from "../cluster/utils";

export const getItem: TaskFunction<Job, void> = async ({ page, data }) => {
  const {
    listItem: { filePath, link },
  } = data;

  if (fs.existsSync(filePath)) {
    console.log("skip");
  } else {
    await page.goto(link);
    const detail = await page.evaluate(pageFunctions.getItem);
    writeFileSync(filePath, { ...detail, ...data });
  }
};

export const pageFunctions = {
  getItem: (): Detail => {
    const $workContent = document.querySelector<HTMLElement>(
      ".job-description__content"
    );
    const $otherRequirement = document.querySelector<HTMLElement>(
      ".job-requirement > .job-requirement p"
    );
    const $welfare = document.querySelector<HTMLElement>(
      ".benefits-description"
    );
    return {
      workContent: $workContent?.innerText,
      otherRequirement: $otherRequirement?.innerText,
      welfare: $welfare?.innerText,
    };
  },
};
