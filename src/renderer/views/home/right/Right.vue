<script setup>
import RightSidebar from "@/views/home/right/RightSidebar.vue";
import RightContent from "@/views/home/right/RightContent.vue";
</script>

<template>
  <div class="im-right">
    <right-sidebar />
    <right-content />
  </div>
</template>

<style>
.im-right {
  display: flex;
  flex: 1;
}
</style>
