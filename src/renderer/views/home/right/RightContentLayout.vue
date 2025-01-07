<script setup>
const prop = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="im-right-content" :class="isActive ? '' : 'bg'">
    <header class="im-right-content-header border-bottom" >
      <slot name="im-right-content-header"></slot>
    </header>
    <slot />
  </div>
</template>

<style>
.im-right-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 0;
}
.im-right-content-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 25px;
  height: 25px;
  line-height: 25px;
  -webkit-app-region: drag; /* 使标题栏可拖动 */
}
.border-bottom {
  border-bottom: 1px solid #ded9d9;
}
.bg {
  background-size: 80px;
  background: #fff url("@/assets/image/qyh.jpg") no-repeat center calc(50% - 30px);
}
</style>
