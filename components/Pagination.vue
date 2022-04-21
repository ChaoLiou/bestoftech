<script lang="ts" setup>
interface Props {
  total: number;
  pageIndex: number;
  pageSize: number;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits();

const itemIndexStart = computed(
  () => (props.pageIndex - 1) * props.pageSize + 1
);

const itemIndexEnd = computed(() => {
  const result = props.pageIndex * props.pageSize;
  return result > props.total ? props.total : result;
});

const maxPageIndex = computed(() => Math.ceil(props.total / props.pageSize));

const updatePageSize = (event) => {
  const newPageSize = parseInt(event.target.value);
  if (props.pageIndex * newPageSize > props.total) {
    emit("update:page-index", 1);
  }
  emit("update:page-size", newPageSize);
};
</script>

<template>
  <div class="pagination">
    <button
      type="button"
      title="第一頁"
      :disabled="props.pageIndex === 1"
      @click="emit('update:page-index', 1)"
    >
      &lt;&lt;
    </button>
    <button
      type="button"
      title="上一頁"
      :disabled="props.pageIndex === 1"
      @click="emit('update:page-index', props.pageIndex - 1)"
    >
      &lt;
    </button>
    <div class="info">
      第 {{ itemIndexStart }} 筆 - 第 {{ itemIndexEnd }} 筆 (共 {{ total }} 筆)
    </div>
    <button
      type="button"
      title="下一頁"
      :disabled="!maxPageIndex || props.pageIndex === maxPageIndex"
      @click="emit('update:page-index', props.pageIndex + 1)"
    >
      &gt;
    </button>
    <button
      type="button"
      title="最後一頁"
      :disabled="!maxPageIndex || props.pageIndex === maxPageIndex"
      @click="emit('update:page-index', maxPageIndex)"
    >
      &gt;&gt;
    </button>
    <select v-model.number="props.pageSize" @change="updatePageSize">
      <option v-for="size in [30, 50, 100]" :key="size" :value="size">
        一頁 {{ size }} 筆
      </option>
    </select>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
}
.pagination > * {
  margin-left: 0.5rem;
}
button {
  border: 1px solid #ffffff;
  background-color: #ffffff29;
  color: #ffffff;
  border-radius: 1rem;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  opacity: 0.7;
}
button:not(:disabled):hover {
  opacity: 1;
}
button:disabled {
  cursor: not-allowed;
}
select {
  padding: 0.5rem;
}
</style>
