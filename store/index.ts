import { defineStore, acceptHMRUpdate } from 'pinia';
import rankingJSON from '@/build/output/parsed/ranking.json';
import allJobCompaniesJSON from '@/build/output/allCompanies.json';
import allJobsJSON from '@/build/output/allJobs.json';
import allJobDetailsJSON from '@/build/output/allJobDetails.json';

export const useStore = defineStore('store', {
  state: () => {
    return {
      ranking: rankingJSON.filter((x) => x.count > 2),
      companies: allJobCompaniesJSON,
      jobs: allJobsJSON,
      details: allJobDetailsJSON,
    };
  },
  actions: {},

  getters: {
    getCompany(state) {
      return (id: string) => state.companies.find((x) => x.id === id);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
