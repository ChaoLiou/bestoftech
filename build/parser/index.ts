import * as fs from "fs";
import { Job, UniversalTech } from "../declarations";
import { readFileSync, writeFileSync } from "../utils";

const _techStack = readFileSync<UniversalTech[]>("build/parser/techStack.json");

const _foldername = `build/output/detail`;
const _filenames = fs.readdirSync(_foldername);

const regexByTech = (lineWrapper: { value: string }, tech: string) => {
  const regexp = new RegExp(
    `(^|[^a-z1-9{])${tech.replace(/\s/g, "\\s")}([^}a-z1-9]|$)`,
    "g"
  );
  const result = regexp.exec(lineWrapper.value);
  if (result) {
    const [_, group1, group2] = result;
    lineWrapper.value = lineWrapper.value.replace(
      regexp,
      `${group1}{{${tech}}}${group2}`
    );
    return tech;
  }
};

const parseLine = (line: string) => {
  const lineWrapper = { value: line };
  const techStack = _techStack
    .map((tech) => {
      if (typeof tech === "string") {
        return regexByTech(lineWrapper, tech);
      } else {
        const results = tech.list.map((t) => regexByTech(lineWrapper, t));
        if (results.some((x) => !!x)) {
          return tech.name;
        }
      }
    })
    .flat()
    .filter((info) => !!info);

  if (techStack.length > 0) {
    return {
      techStack,
      line: lineWrapper.value,
    };
  }
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
    listItem: { id },
  } = job;
  const lines = splitToLines(workContent, otherRequirement);
  const result = lines
    .map(parseLine)
    .filter((x) => !!x)
    .flat();

  writeFileSync(`build/output/parsed/lvl1/${id}.json`, result);

  const parsed = {
    lines: result.map((x) => x.line),
    techStack: Array.from(new Set(result.map((x) => x.techStack).flat())),
  };
  writeFileSync(`build/output/parsed/lvl2/${id}.json`, { ...job, parsed });

  return { ...job, parsed };
};

const parsedJobs = _filenames
  .map((filename) => readFileSync<Job>(`${_foldername}/${filename}`))
  .map(parseJobContent);

const techStackCounter = parsedJobs
  .reduce((prev, curr) => {
    const {
      parsed: { techStack },
      listItem: { id },
    } = curr;
    techStack.forEach((tech) => {
      const target = prev.find((x) => x.tech === tech);
      if (target) {
        target.list.push(id);
      } else {
        prev.push({ tech, list: [id] });
      }
    });
    return prev;
  }, [])
  .map((x) => ({ ...x, count: x.list.length }))
  .sort((a, b) => b.count - a.count);

writeFileSync("build/output/parsed/ranking.json", techStackCounter);
