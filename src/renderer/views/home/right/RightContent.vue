<script setup>
import { computed } from "vue";
import RightContentLayout from "@/views/home/right/RightContentLayout.vue";
import RightContentHeader from "@/views/home/right/RightContentHeader.vue";
import ChatWarp from "@/views/home/chat/ChatWarp.vue";
import { useImAccountStore } from "@/stores/imAccountStore";

const imAccountStore = useImAccountStore();
const isActiveSession = computed(() => Object.keys(imAccountStore.imActiveSession).length > 0);
</script>

<template>
  <right-content-layout :is-active="isActiveSession">
    <template v-slot:im-right-content-header>
      <right-content-header title="title" />
    </template>
    <chat-warp v-show="isActiveSession" />
  </right-content-layout>
</template>

<style>
</style>
