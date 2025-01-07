<script setup>
import { useImMessageStore } from "@/stores/imMessageStore";

const imMessagesStore = useImMessageStore();

const emit = defineEmits(['followUpClick']);
const followUpClick = (text) => {
  emit('followUpClick', text);
}
</script>

<template>
  <div class="message-follow-up">
    <div class="message-follow-up-item" v-for="(text, index) in imMessagesStore.msgFollowUp" :key="index">
      <div class="follow-up-body" @click="followUpClick(text)">
        <div class="follow-up-body-text">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<style>
.message-follow-up {
  display: flex;
  flex-direction: column;
  padding: 8px 8px 8px 56px;
}
.message-follow-up-item {
  max-width: 442px;
  min-width: 50px;
  margin-bottom: 8px;
}
.follow-up-body {
  display: inline-block;
  padding: 10px 16px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
}
</style>
