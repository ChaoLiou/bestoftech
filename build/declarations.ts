export interface Job {
  params: Params;
  listItem?: ListItem;
  // detail?: Detail;
  workContent: string;
  otherRequirement: string;
  welfare: string;
}

export interface Params {
  listPage: PageParams;
  detailPage?: PageParams;
}

export interface ListItem {
  id: string;
  filePath: string;
  name: string;
  link: string;
  company: {
    id: string;
    name: string;
    link: string;
    type: string;
  };
  location: string;
  requirement: {
    experience: string;
    education: string;
  };
  description: string;
  tags: string[];
}

export interface Detail {
  workContent: string;
  otherRequirement: string;
  welfare: string;
}

export interface PageParams {
  total: number;
  index: number;
}

export interface Tech {
  name: string;
  list: string[];
}

export type UniversalTech = Tech | string;
