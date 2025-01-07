<script setup>
import RightHeader from "@/views/home/right/RightHeader.vue";
import ConversationItem from "@/views/home/right/ConversationItem.vue";
import { useImAccountStore } from "@/stores/imAccountStore";
import { imActiveSessionChange } from "@/utils/nim";
import { computed } from "vue";

const imSessionStore = useImAccountStore();
const sortedSessions = computed(() => imSessionStore.getSessionMapList());

const handleActiveChange = (session) => {
  imActiveSessionChange(session, true);
}
</script>

<template>
  <div class="right-sidebar">
    <div class="conversation-list-wrapper">
      <right-header />
      <conversation-item
        v-for="(session, index) in sortedSessions"
        :key="index"
        :is-active="imSessionStore.imActiveSession.id === session.id"
        :session="session"
        @active-change="handleActiveChange"
      />
    </div>
  </div>
</template>

<style>
.right-sidebar {
  width: 5.2rem;
  border-right: 1px solid #ded9d9;
  background-color: #f7f7f7;
}
.conversation-list-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
