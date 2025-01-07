import { defineStore } from "pinia";
import { ref } from "vue";

export const useMsgListScrollStore = defineStore('msgListScroll', () => {
  // 是否滚动到最底部
  const isToBottom = ref(false);
  const setIsToBottom = (toBottom) => {
    isToBottom.value = toBottom;
  }

  return {
    isToBottom,
    setIsToBottom
  }
})
