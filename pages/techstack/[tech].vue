<script lang="ts" setup>
import { useStore } from "@/store";

const route = useRoute();
const store = useStore();
const techstack = computed(() =>
  store.list.find((item) => item.name === route.params.tech)
);
</script>

<template>
  <div>
    <h1>關鍵字: {{ techstack.name }}</h1>
    <div>
      <div v-for="(item, index) in techstack.list" :key="index">
        <div>{{ item.name }}</div>
        <div>{{ item.companyIds }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
