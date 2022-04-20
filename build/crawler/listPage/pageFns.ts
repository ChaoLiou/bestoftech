import { ListItem } from "../../declarations";

export const pageFunctions = {
  getTotal: (): number => {
    return document.querySelectorAll(
      ".page-select.js-paging-select.gtm-paging-top option"
    ).length;
  },
  getList: (): ListItem[] => {
    const getItem = (el: HTMLElement): ListItem => {
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
      const $description = el.querySelector<HTMLElement>(
        ".job-list-item__info"
      );
      const $tags = Array.from(
        el.querySelectorAll<HTMLElement>(".job-list-tag > span")
      ).map(($tag) => $tag);

      const link = `https://${$name?.getAttribute("href")}`;
      const companyLink = `https://${$companyName?.getAttribute("href")}`;
      const id = new URL(link).pathname.substring(5);
      const companyId = new URL(companyLink).pathname.substring(9);

      return {
        id,
        filePath: `output/detail/${id}.json`,
        name: $name?.innerText,
        link,
        company: {
          id: companyId,
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
    };

    return Array.from(
      document.querySelectorAll(
        "article.job-list-item:not(.js-job-item--recommend)"
      )
    )
      .map(getItem)
      .filter((x) => !!x.name && !!x.company.name);
  },
};
