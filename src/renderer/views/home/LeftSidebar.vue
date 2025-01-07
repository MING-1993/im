<script setup lang="ts">
import Avatar from "@/views/home/Avatar.vue";
</script>

<template>
  <div class="left-sidebar">
    <div class="sidebar-operation">
      <avatar />
    </div>
  </div>
</template>

<style>
.left-sidebar {
  width: 1.3rem;
  background-color: rgba(211, 211, 211, .7);
  height: 100%;
  -webkit-app-region: drag; /* 使标题栏可拖动 */
}
.sidebar-operation {
  margin-top: 1.3rem;
  text-align: center;
}
</style>
