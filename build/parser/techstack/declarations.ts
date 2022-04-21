export interface TechStackGroupInterface {
  name: string;
  list: TechStackInterface[];
  count: number;
}

export interface TechStackInterface {
  companyIds: string[];
  name: string;
  count: number;
}

export interface ParsedJob {
  jobId: string;
  techstack: string[];
  companyId: string;
}

export interface ParsedJobGroupByCompany {
  companyId: string;
  techstack: string[];
}
