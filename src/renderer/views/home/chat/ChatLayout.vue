<script setup>
import { ref, watch, nextTick } from "vue";
import vScroll from "@/directives/vScroll";
import { useMsgListScrollStore } from "@/stores/msgListScrollStore";

defineOptions({
  directives: {
    scroll: vScroll
  }
});
const messageList = ref(null);
const scrollTop = () => {
  let sTop = messageList.value.scrollTop;
}

const msgListScrollStore = useMsgListScrollStore();
const scrollToBottom = () => {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight;
    }
  });
  msgListScrollStore.setIsToBottom(false);
}
watch(
  () => msgListScrollStore.isToBottom,
  (newValue) => {
    if (newValue) scrollToBottom();
  }
);
</script>

<template>
  <div class="content">
    <div class="chat-wrap">
      <div class="chat-content">
        <div class="chat-message-list" ref="messageList" v-scroll="scrollTop">
          <div class="chat-message-list-tip">
            <slot name="chat-message-list-tip">没有更多消息了</slot>
          </div>
          <slot name="chat-message-list"></slot>
          <slot name="chat-message-follow-up"></slot>
        </div>
        <slot name="chat-message-input"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.content {
  position: relative;
  flex: 1;
  overflow: hidden;
  user-select: text;
}
.chat-wrap {
  height: 100%;
  width: 100%;
  display: flex;
}
.chat-content {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.chat-message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.chat-message-list-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
}
</style>
