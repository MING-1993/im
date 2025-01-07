import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useImAccountStore = defineStore('imAccount', () => {
  // IM账户信息
  const imAccount = ref({})
  // 设置账户信息
  const setAccount = (account) => {
    return new Promise((resolve) => {
      imAccount.value = account
      resolve()
    })
  }
  // 会话 Map，键为会话 ID
  const imSessionMap = reactive({})
  // 设置会话信息
  const setSessionMap = (session) => {
    imSessionMap[session.id] = session
  }
  // 排序函数
  const sortSession = (sessionA, sessionB) => {
    if (sessionA.isTop && !sessionB.isTop) {
      return -1; // 置顶的优先
    } else if (!sessionA.isTop && sessionB.isTop) {
      return 1; // 非置顶的靠后
    } else {
      return sessionB.updateTime - sessionA.updateTime; // 按更新时间降序
    }
  };
  // 获取排序后的会话列表
  const getSessionMapList = () => {
    return Object.keys(imSessionMap)
      .map((id) => imSessionMap[id])
      .sort(sortSession); // 按自定义规则排序
  }

  // im账号基础信息
  const imUserProfiles = reactive({});
  const setImUserProfiles = (user) => {
    imUserProfiles[user.account] = user;
  }

  // 当前选中会话
  const imActiveSession = reactive({});
  const setImActiveSession = (session) => {
    Object.assign(imActiveSession, session);
  }

  return {
    imAccount,
    setAccount,
    imSessionMap,
    getSessionMapList,
    setSessionMap,
    imUserProfiles,
    setImUserProfiles,
    imActiveSession,
    setImActiveSession
  }
})
