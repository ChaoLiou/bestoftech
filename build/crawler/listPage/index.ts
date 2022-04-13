import * as fs from "fs";
import { TaskFunction } from "puppeteer-cluster/dist/Cluster";
import { Job, ListItem } from "../cluster/declarations";
import { getItem as getItemOnDetailPage } from "../detailPage";
import { combineUrl, readFileSync, writeFileSync } from "../cluster/utils";
import { ClusterSingleton } from "../cluster";

export const getList: TaskFunction<Job, void> = async ({
  page,
  data: { params },
}) => {
  const cluster = await ClusterSingleton.getInstance();
  const cachePath = `list-${params.listPage.index}-${params.listPage.total}.json`;

  let list = [];
  if (fs.existsSync(cachePath)) {
    list = readFileSync<ListItem[]>(cachePath);
  } else {
    const pageUrl = combineUrl(params.listPage.index);
    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
    list = await page.evaluate(pageFunctions.getList);
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

export const pageFunctions = {
  getTotal: (): number => {
    return document.querySelectorAll(
      ".page-select.js-paging-select.gtm-paging-top option"
    ).length;
  },
  getList: (): ListItem[] =>
    Array.from(
      document.querySelectorAll(
        "article.job-list-item:not(.js-job-item--recommend)"
      )
    )
      .map(pageFunctions.getItem)
      .filter((x) => !!x.name && !!x.company.name),
  getItem: (el: HTMLElement): ListItem => {
    const $name = el.querySelector<HTMLElement>(".b-tit > a");
    const $companyName = el.querySelector<HTMLElement>(
      "ul > li:nth-of-type(2) > a"
    );
    const $companyType = el.querySelector<HTMLElement>(
      "ul > li:nth-of-type(3)"
    );
    const $location = el.querySelector<HTMLElement>(
      "ul:nth-of-type(2) > li:nth-of-type(1)"
    );
    const $requiredExperience = el.querySelector<HTMLElement>(
      "ul:nth-of-type(2) > li:nth-of-type(2)"
    );
    const $requiredEducation = el.querySelector<HTMLElement>(
      "ul:nth-of-type(2) > li:nth-of-type(3)"
    );
    const $description = el.querySelector<HTMLElement>(".job-list-item__info");
    const $tags = Array.from(
      el.querySelectorAll<HTMLElement>(".job-list-tag > span")
    ).map(($tag) => $tag);

    const link = `https://${$name?.getAttribute("href")}`;
    const companyLink = `https://${$companyName?.getAttribute("href")}`;
    const id = new URL(link).pathname.substring(5);

    return {
      id,
      filePath: `output/${id}.json`,
      name: $name?.innerText,
      link,
      company: {
        name: $companyName?.innerText,
        link: companyLink,
        type: $companyType?.innerText,
      },
      location: $location?.innerText,
      requirement: {
        experience: $requiredExperience?.innerText,
        education: $requiredEducation?.innerText,
      },
      description: $description?.innerText,
      tags: $tags.map(($tag) => $tag?.innerText),
    };
  },
};
