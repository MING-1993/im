<script setup>
import { ref } from 'vue'

const searchText = ref('');
</script>

<template>
  <div class="right-header">
    <div class="m-search-input">
      <input type="text" autocomplete="off" placeholder="搜索" v-model="searchText" class="el-input__inner">
    </div>
    <span class="add-search">+</span>
  </div>
</template>

<style>
.right-header {
  display: flex;
  position: relative;
  align-items: center;
  padding: .24rem;
  gap: 5px;
  -webkit-app-region: drag;
}
.m-search-input {
  position: relative;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  cursor: text;
  -webkit-app-region: no-drag;
}
.el-input__inner {
  -webkit-appearance: none;
  display: inline-block;
  height: .5rem;
  line-height: .5rem;
  background-color: #eaeaea;
  border: 1px solid #dcdfe6;
  width: 100%;
  padding: 0 15px;
  cursor: text;
}
.add-search {
  padding: 5px;
  -webkit-app-region: no-drag;
}
</style>
