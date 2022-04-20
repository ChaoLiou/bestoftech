import { UniversalTech } from "../../declarations";
import { readFileSync, writeFileSync } from "../../utils";

const filename = "build/parser/techStack.json";
const techStack = readFileSync<UniversalTech[]>(filename);

techStack.sort((a, b) => {
  if (typeof b === "string") {
    if (typeof a === "string") {
      return b.length - a.length;
    } else {
      return 1;
    }
  } else {
    if (typeof a === "string") {
      return -1;
    } else {
      return b.name.length - a.name.length;
    }
  }
});

writeFileSync(filename, techStack);
