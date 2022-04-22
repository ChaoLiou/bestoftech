import { Tech } from "../../declarations";
import { readFileSync, writeFileSync } from "../../utils";

const filename = "build/parser/techstackGroups.json";
const techStack = readFileSync<Tech[]>(filename);

techStack
  .sort((a, b) => {
    return b.name.length - a.name.length;
  })
  .map((x) => ({ ...x, list: x.list.sort((a, b) => b.length - a.length) }));

writeFileSync(filename, techStack);
