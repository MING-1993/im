<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  channel: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div>
    <span>{{ title }}</span>
    <span class="channel">{{ channel }}</span>
  </div>
  <span class="im-right-content-height-more">
    <i class="el-icon-more">...</i>
  </span>
</template>

<style>
.im-right-content-height-more {
  line-height: 15px;
  font-size: 20px;
}
</style>
