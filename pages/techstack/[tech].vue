<script lang="ts" setup>
import { useStore } from "@/store";

const route = useRoute();
const store = useStore();
const techstack = computed(() =>
  store.ranking.find((item) => item.name === route.params.tech)
);

const opened = ref([]);

const toggleTechInOut = (tech: string) => {
  if (opened.value.includes(tech)) {
    opened.value = opened.value.filter((x) => x !== tech);
  } else {
    opened.value.push(tech);
  }
};
</script>

<template>
  <div>
    <h1>關鍵字: {{ techstack.name }}</h1>
    <div class="tech-list">
      <div v-for="(item, index) in techstack.list" :key="index" class="tech-item">
        <div class="visible-part" @click="toggleTechInOut(item.name)">{{ item.name }}</div>
        <div v-show="opened.includes(item.name)" class="invisible-part">
          <div v-for="company in item.companyIds.map(store.getCompany)" :key="company.id">
            {{ company.name.replace(/(股份)?有限公司(台灣分公司)?/, '') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tech-list {
  display: grid;
  grid-gap: 1rem;
  padding: 1rem 0;
}

.tech-item {
  background-color: #ffffff29;
}

.tech-item>.visible-part {
  padding: 1rem 2rem;
  cursor: pointer;
}

.tech-item>.invisible-part {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 0.5rem;
  padding: 0.5rem;
}

.tech-item>.invisible-part>div {
  background-color: #4d4d4d;
  padding: 0.5rem 1rem;
}
</style>
