import * as fs from "fs";
import { Job } from "../../declarations";
import { distinct, readFileSync, writeFileSync } from "../../utils";

const uselesswords = readFileSync<string[]>("build/parser/uselesswords.json");

const _foldername = `build/output/detail`;
const _filenames = fs.readdirSync(_foldername);

const parseLine = (line: string) => {
  const regexp = /(\.?[a-z]+[\s\-0-9#]*\.?(\+{2})?)+/g;
  let matches = [];
  let output = [];
  line = line.replace(/https?:\/\/[^\s$]+/, "");
  while ((matches = regexp.exec(line))) {
    let candidate = matches[0].replace(/\.$/g, "");
    uselesswords.forEach(
      (words) =>
        (candidate = candidate.replace(
          new RegExp(`(^|\\s)${words}(\\s|$)`),
          ""
        ))
    );
    candidate = candidate.trim();
    if (candidate.split(" ").length <= 3) {
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
    .map((content) => content.split("\n"))
    .flat()
    .filter((line) => !!line.trim())
    .map((line) => line.toLowerCase());

const parseJobContent = (job: Job) => {
  const {
    workContent,
    otherRequirement,
    listItem: {
      id,
      company: { id: companyId, link },
    },
  } = job;

  const lines = splitToLines(workContent, otherRequirement);
  const result = lines.map(parseLine);
  const result2 = result
    .map((x) => x.techstack)
    .filter((x) => !!x)
    .flat();

  const distinctResult = distinct(result2);
  writeFileSync(`build/output/parsed/techstack/${id}.json`, distinctResult);

  return {
    id,
    techstack: distinctResult,
    companyId: new URL(link).pathname.substring(9),
    lines: result.map((x) => x.line).filter((x) => !!x),
  };
};

const result = _filenames
  .map((filename) => readFileSync<Job>(`${_foldername}/${filename}`))
  .map(parseJobContent);

const result2 = result.reduce((prev, curr) => {
  const target = prev.find((x) => x.id === curr.companyId);
  if (target) {
    target.techstack = distinct([...target.techstack, ...curr.techstack]);
  } else {
    prev.push({
      id: curr.companyId,
      techstack: curr.techstack,
    });
  }
  return prev;
}, []);

const groupResult = result2
  .reduce((prev, curr) => {
    curr.techstack.forEach((tech) => {
      const target = prev.find((x) => x.name === tech);
      if (target) {
        target.ids.push(curr.id);
      } else {
        prev.push({ name: tech, ids: [curr.id] });
      }
    });
    return prev;
  }, [])
  .map((x) => ({ ...x, count: x.ids.length }));

writeFileSync(
  `build/output/parsed/techstack/ranking.json`,
  groupResult.sort((a, b) =>
    b.count === a.count ? a.name.length - b.name.length : b.count - a.count
  )
);
