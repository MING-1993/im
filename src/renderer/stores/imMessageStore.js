import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useImMessageStore = defineStore('imMessages', () => {
  // 会话消息
  const imSessionMsg = reactive({});

  // 设置会话消息
  const setSessionMsg = (sessionId, messages) => {
    imSessionMsg[sessionId] = messages;
  }

  // 会话未读总数
  const imUnreadCount = ref(0);
  const setImUnreadCount = (num) => {
    imUnreadCount.value = num;
  }

  // 消息跟随内容
  const msgFollowUp = ref([]);
  // 设置消息跟随内容
  const setMsgFollowUp = (msgFollowUp) => {
    msgFollowUp.value = msgFollowUp;
  }

  return {
    imSessionMsg,
    setSessionMsg,
    imUnreadCount,
    setImUnreadCount,
    msgFollowUp,
    setMsgFollowUp
  }
})
