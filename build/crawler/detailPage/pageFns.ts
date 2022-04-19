import { Detail } from '../../declarations';

export const pageFunctions = {
  getItem: (): Detail => {
    const $workContent = document.querySelector<HTMLElement>(
      '.job-description__content'
    );
    const $otherRequirement = document.querySelector<HTMLElement>(
      '.job-requirement > .job-requirement p'
    );
    const $welfare = document.querySelector<HTMLElement>(
      '.benefits-description'
    );
    return {
      workContent: $workContent?.innerText,
      otherRequirement: $otherRequirement?.innerText,
      welfare: $welfare?.innerText,
    };
  },
};
