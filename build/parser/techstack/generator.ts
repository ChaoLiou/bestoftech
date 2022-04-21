import * as fs from 'fs';
import { Job } from '../../declarations';
import { distinct, readFileSync, writeFileSync } from '../../utils';
import {
  ParsedJobGroupByCompany,
  TechStackGroupInterface,
  TechStackInterface,
} from './declarations';

interface UselessWords {
  matched: string[];
  contains: string[];
}

const _uselesswords = readFileSync<UselessWords>(
  'build/parser/uselesswords.json'
);
const _techstackGroupsConfig = readFileSync<{ name: string; list: string[] }[]>(
  'build/parser/techstackGroups.json'
);

const _foldername = `build/output/detail`;
const _filenames = fs.readdirSync(_foldername);

const parseLine = (line: string) => {
  const regexp = /(\.?[a-z]+[\s\-0-9#]*\.?(\+{2})?)+/g;
  let matches = [];
  let output = [];
  line = line.replace(/https?:\/\/[^\s$]+/, '');
  while ((matches = regexp.exec(line))) {
    let candidate = matches[0].replace(/\.$/g, '');
    _uselesswords.contains.forEach(
      (words) =>
        (candidate = candidate.replace(
          new RegExp(`(^|\\s)${words}(\\s|$)`, 'g'),
          ' '
        ))
    );
    candidate = candidate.trim();
    _uselesswords.matched.forEach(
      (word) =>
        (candidate = candidate.replace(new RegExp(`^${word}$`, 'g'), ''))
    );
    candidate = candidate.trim();
    if (candidate.split(' ').length <= 3) {
      const splitWithAndOr = candidate.split(/(^|\s)and\/or(\s|$)/);
      const splitWithAnd = candidate.split(/(^|\s)and(\s|$)/);
      const splitWithOr = candidate.split(/(^|\s)or(\s|$)/);
      if (splitWithAndOr.length > 0) {
        output.push(...splitWithAndOr.filter((x) => !!x.trim()));
      } else if (splitWithAnd.length > 0) {
        output.push(...splitWithAnd.filter((x) => !!x.trim()));
      } else if (splitWithOr.length > 0) {
        output.push(...splitWithOr.filter((x) => !!x.trim()));
      } else if (!!candidate) {
        output.push(candidate);
      }
    }
  }
  return {
    line: output.length > 0 ? line : null,
    techstack: output,
  };
};

const splitToLines = (...contents: string[]) =>
  contents
    .map((content) => content.split('\n'))
    .flat()
    .filter((line) => !!line.trim())
    .map((line) => line.toLowerCase());

const parseByJob = (job: Job) => {
  const {
    detail: { workContent, otherRequirement },
    listItem: {
      id,
      company: { id: companyId, link },
    },
  } = job;

  const lines = splitToLines(workContent, otherRequirement);
  const result = lines.map(parseLine);

  const distinctResult = distinct(
    result
      .map((x) => x.techstack)
      .filter((x) => !!x)
      .flat()
  );

  return {
    id,
    techstack: distinctResult,
    companyId: new URL(link).pathname.substring(9),
  };
};

const parsedJobs = _filenames
  .map((filename) => readFileSync<Job>(`${_foldername}/${filename}`))
  .map(parseByJob);

const parsedJobsGroupByCompany = parsedJobs.reduce((prev, curr) => {
  const target = prev.find((x) => x.companyId === curr.companyId);
  if (target) {
    target.techstack = distinct([...target.techstack, ...curr.techstack]);
  } else {
    prev.push({
      companyId: curr.companyId,
      techstack: curr.techstack,
    });
  }
  return prev;
}, [] as ParsedJobGroupByCompany[]);

const techStacks = parsedJobsGroupByCompany.reduce((prev, curr) => {
  curr.techstack.forEach((tech) => {
    const target = prev.find((x) => x.name === tech);
    if (target) {
      target.companyIds.push(curr.companyId);
      target.count += 1;
    } else {
      prev.push({ name: tech, companyIds: [curr.companyId], count: 1 });
    }
  });
  return prev;
}, [] as TechStackInterface[]);

const techStackGroups = techStacks.reduce((prev, curr) => {
  const config = _techstackGroupsConfig.find((group) =>
    group.list.includes(curr.name)
  );
  if (config) {
    const target = prev.find((group) => group.name === config.name);
    if (target) {
      target.list.push(curr);
      target.count += curr.count;
    } else {
      prev.push({ name: config.name, count: curr.count, list: [curr] });
    }
  } else {
    prev.push({ name: curr.name, count: curr.count, list: [curr] });
  }
  return prev;
}, [] as TechStackGroupInterface[]);

const sortTechStackGroups = (source: TechStackGroupInterface[]) =>
  source.sort((a, b) =>
    b.count === a.count ? a.name.length - b.name.length : b.count - a.count
  );

writeFileSync(
  `build/output/parsed/ranking.json`,
  sortTechStackGroups(techStackGroups)
);
