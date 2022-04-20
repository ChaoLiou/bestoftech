<script lang="ts" setup></script>

<template>
  <div class="layout__default">
    <header></header>
    <div></div>
    <main>
      <slot />
    </main>
    <footer></footer>
  </div>
</template>

<style scoped>
.layout__default {
  background-color: #1a1a1a;
  color: white;
}
main {
  width: 80%;
  margin: auto;
  min-height: 100vh;
}
</style>
