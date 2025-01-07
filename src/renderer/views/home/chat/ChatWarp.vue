<script setup>
import ChatLayout from "@/views/home/chat/ChatLayout.vue";
import ChatMessage from "@/views/home/chat/ChatMessage.vue";
import ChatMessageFollowUp from "@/views/home/chat/ChatMessageFollowUp.vue";
import ChatInput from "@/views/home/chat/ChatInput.vue";

const followUpClick = (text) => {
  console.log(text)
}
</script>

<template>
  <chat-layout>
    <template v-slot:chat-message-list>
      <chat-message />
    </template>
    <template v-slot:chat-message-follow-up>
      <chat-message-follow-up @follow-up-click="followUpClick" />
    </template>
    <template v-slot:chat-message-input>
      <ChatInput />
    </template>
  </chat-layout>
</template>

<style>
</style>
