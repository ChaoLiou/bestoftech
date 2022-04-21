import * as fs from 'fs';
import { Job } from '../declarations';
import { readFileSync, writeFileSync } from '../utils';

const getJob = (job: Job) => {
  const { listItem } = job;
  return {
    id: listItem.id,
    name: listItem.name,
    link: listItem.link,
    company: listItem.company.id,
  };
};

const getJobDetail = (job: Job) => {
  const { listItem, detail } = job;
  return {
    id: listItem.id,
    workContent: detail.workContent,
    otherRequirement: detail.otherRequirement,
    company: listItem.company.id,
  };
};

const getCompany = (prev: any[], curr: Job) => {
  const target = prev.find((x) => x.id === curr.listItem.company.id);
  if (target) {
    target.jobs.push(curr.listItem.id);
  } else {
    const { id, name, link, type } = curr.listItem.company;
    prev.push({ id, name, link, type, jobs: [curr.listItem.id] });
  }
  return prev;
};

const _foldername = `build/output`;
const _filenames = fs.readdirSync(`${_foldername}/detail`);
const list = _filenames.map((filename) =>
  readFileSync<Job>(`${_foldername}/detail/${filename}`)
);

const jobs = list.map(getJob);
writeFileSync(`${_foldername}/allJobs.json`, jobs);

const jobDetails = list.map(getJobDetail);
writeFileSync(`${_foldername}/allJobDetails.json`, jobDetails);

const companies = list.reduce(getCompany, []);
writeFileSync(`${_foldername}/allCompanies.json`, companies);
