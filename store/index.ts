import { defineStore, acceptHMRUpdate } from "pinia";
import rankingJSON from "@/build/output/parsed/ranking.json";

export const useStore = defineStore("ranking", {
  state: () => {
    return {
      list: rankingJSON.filter((x) => x.count > 2),
    };
  },
  actions: {},

  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
