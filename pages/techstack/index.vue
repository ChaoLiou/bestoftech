<script lang="ts" setup>
import ranking from "@/build/output/parsed/techstack/ranking.json";

const source = ref(ranking.filter((x) => x.count > 1));

const wordLengthTags = source.value.reduce((prev, curr) => {
  const words = curr.name.split(" ");
  if (!prev.includes(words.length)) {
    prev.push(words.length);
  }
  return prev;
}, []);

const tags = ref([]);
const keyword = ref("");
const pageIndex = ref(1);
const pageSize = ref(30);
const opened = ref([]);

const filteredSource = computed(() => {
  pageIndex.value = 1;
  return source.value
    .filter((x) => {
      const keywords = keyword.value.split(",");
      return keywords.length > 1
        ? keywords.some((k) => !!k && x.name.includes(k))
        : x.name.includes(keyword.value);
    })
    .filter((x) => {
      const wordLength = x.name.split(" ").length;
      return tags.value.length === 0 || tags.value.includes(wordLength);
    });
});

const pagedSource = computed(() => {
  const index = pageIndex.value - 1;
  return filteredSource.value.slice(
    index * pageSize.value,
    (index + 1) * pageSize.value
  );
});

const toggleTagInOut = (tag: string) => {
  if (tags.value.includes(tag)) {
    tags.value = tags.value.filter((t) => t !== tag);
  } else {
    tags.value.push(tag);
  }
};

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
    <h1>All Keywords</h1>
    <div>
      <div class="toolbar">
        <div class="filter">
          <input v-model="keyword" class="search" />
          <div class="tag-list">
            <div
              v-for="tag in wordLengthTags"
              :key="tag"
              class="tag-item"
              :class="{ selected: tags.includes(tag) }"
              @click="toggleTagInOut(tag)"
            >
              {{ tag }} word
            </div>
          </div>
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
          <div class="main-part" @click="toggleTechInOut(tech)">
            <h3>{{ tech.name }}</h3>
            <h3>{{ tech.count }}</h3>
          </div>
          <div v-show="opened.includes(tech)">
            {{ tech.lines }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tech-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1rem;
}
.tech-item {
  background-color: #ffffff29;
}
.tech-item > .main-part {
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
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
  height: 2rem;
}
.tag-list {
  display: flex;
  width: 300px;
  overflow: auto;
}
.tag-list > * {
  margin-left: 1rem;
}
.tag-item {
  border: 1px solid #ffffff;
  background-color: #ffffff29;
  opacity: 0.7;
  padding: 0 0.5rem;
  border-radius: 1rem;
  cursor: pointer;
}
.tag-item:hover {
  opacity: 1;
}
.tag-item.selected {
  background-color: #ffffff;
  color: #000000;
}
</style>
