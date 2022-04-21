import * as fs from 'fs';
import * as path from 'path';

export const combineUrl = (pageIndex: number) =>
  `https://www.104.com.tw/jobs/search/?ro=1&jobcat=2007001006%2C2007001010%2C2007001001%2C2007001004&kwop=7&keyword=%E5%89%8D%E7%AB%AF%20%E5%BE%8C%E7%AB%AF%20%E5%85%A8%E7%AB%AF%20IOS%20ANDROID&expansionType=area%2Cspec%2Ccom%2Cjob%2Cwf%2Cwktm&order=17&asc=0&sctp=M&scmin=50000&scstrict=1&scneg=0&s9=1&s5=0&wktm=1&mode=s&jobsource=2018indexpoc&langFlag=0&langStatus=0&recommendJob=1&hotJob=1&page=${pageIndex}`;

export const writeFileSync = (filePath: string, anything: any) => {
  var dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(anything, null, 2));
};

export const readFileSync = <T>(filePath: string): T =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'));

export const appendFileSync = (filePath: string, anything: any) => {
  let list = [];
  if (fs.existsSync(filePath)) {
    list = readFileSync<string[]>(filePath);
  }
  list.push(anything);
  writeFileSync(filePath, list);
};

export const distinct = (source: string[]) => Array.from(new Set(source));
