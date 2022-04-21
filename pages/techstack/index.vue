<script lang="ts" setup>
import { useStore } from "@/store";

const store = useStore();
const source = ref(store.list);

const keyword = ref("");
const pageIndex = ref(1);
const pageSize = ref(30);
const opened = ref([]);

const filteredSource = computed(() => {
  pageIndex.value = 1;
  return source.value.filter((x) => {
    try {
      return new RegExp(keyword.value).test(x.name);
    } catch (error) {
      return x.name.includes(keyword.value);
    }
  });
});

const pagedSource = computed(() => {
  const index = pageIndex.value - 1;
  return filteredSource.value.slice(
    index * pageSize.value,
    (index + 1) * pageSize.value
  );
});

const toggleTechInOut = (tech: string) => {
  if (opened.value.includes(tech)) {
    opened.value = opened.value.filter((x) => x !== tech);
  } else {
    opened.value.push(tech);
  }
};

watch([pageIndex, pageSize], () => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div>
    <div class="techstack">
      <h1>所有關鍵字</h1>
      <div class="toolbar">
        <div class="filter">
          <input
            v-model="keyword"
            class="search"
            placeholder="篩選關鍵字;支援 RegExp"
          />
        </div>
        <Pagination
          :total="filteredSource.length"
          v-model:page-index="pageIndex"
          v-model:page-size="pageSize"
        />
      </div>
      <div class="tech-list">
        <div
          v-for="(tech, index) in pagedSource"
          :key="index"
          class="tech-item"
        >
          <div class="visible-part" @click="toggleTechInOut(tech.name)">
            <h3>
              <NuxtLink
                :to="{ name: 'techstack-tech', params: { tech: tech.name } }"
              >
                {{ tech.name }}
              </NuxtLink>
              <span v-if="tech.list.length > 1">({{ tech.list.length }})</span>
            </h3>
            <h3>{{ tech.count }}</h3>
          </div>
          <div
            v-show="opened.includes(tech.name)"
            class="invisible-part tech-item"
          >
            <div v-for="(item, index) in tech.list" :key="index">
              <h5>{{ item.name }}</h5>
              <h5>{{ item.count }}</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="toolbar">
        <div></div>
        <Pagination
          :total="filteredSource.length"
          v-model:page-index="pageIndex"
          v-model:page-size="pageSize"
        />
      </div>
    </div>
    <NuxtChild></NuxtChild>
  </div>
</template>

<style scoped>
.tech-list {
  display: grid;
  grid-gap: 1rem;
}
.tech-item {
  background-color: #ffffff29;
}
.tech-item > * {
  display: flex;
  justify-content: space-between;
}
.tech-item > .visible-part {
  padding: 1rem 2rem;
  cursor: pointer;
}
.visible-part span {
  font-size: 0.5rem;
}
.tech-item > .invisible-part {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 0.5rem;
  padding: 0.5rem;
}
.tech-item > .invisible-part > div {
  background-color: #4d4d4d;
  padding: 0.5rem 1rem;
}
.toolbar {
  display: flex;
  padding: 2rem 0px;
  justify-content: space-between;
}
.filter {
  display: flex;
  align-items: center;
}
.search {
  padding: 0 0.5rem;
  width: 300px;
  height: 2rem;
}
</style>
