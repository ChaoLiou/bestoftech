import * as fs from "fs";
import { Job } from "../declarations";
import { readFileSync, writeFileSync } from "../utils";

const _foldername = `build/output/detail`;
const _filenames = fs.readdirSync(_foldername);

_filenames
  .map((filename) => readFileSync<any>(`${_foldername}/${filename}`))
  .forEach((job) => {
    const companyId = new URL(job.listItem.company.link).pathname.substring(9);
    writeFileSync(`${_foldername}2/${job.listItem.id}.json`, {
      params: job.params,
      listItem: {
        ...job.listItem,
        company: {
          id: companyId,
          ...job.listItem.company,
        },
      },
      detail: {
        workContent: job.workContent,
        otherRequirement: job.otherRequirement,
        welfare: job.welfare,
      },
    } as Job);
  });
