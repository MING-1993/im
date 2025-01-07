<script setup>
import defaultAvatar from '@/assets/image/default.jpeg';

const props = defineProps({
  avatar: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="avatar-icon">
    <span class="m-avatar">
      <img :src="avatar || defaultAvatar" alt="">
    </span>
  </div>
</template>

<style>
.m-avatar {
  width: .8rem;
  height: .8rem;
  line-height: .8rem;
  vertical-align: middle;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: .16rem;
  display: inline-block;
}
.m-avatar>img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>
