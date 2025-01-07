<script setup>
import { computed, ref } from 'vue';
import { useRouter } from "vue-router";
import { ElInput, ElButton, ElNotification} from "element-plus";
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/notification/style/css';
import { useImAccountStore } from "@/stores/imAccountStore";
import { initializeNim, fetchUserInfo, addMsgToMsgArr, sendMsgReceipt, markMsgReceived } from "@/utils/nim";
import { useImMessageStore } from "@/stores/imMessageStore";
import { useMsgListScrollStore } from "@/stores/msgListScrollStore";

const appKey = ref('');
const user = ref('');
const pwd = ref('');
const router = useRouter(); // 获取 router 实例
const imAccountStore = useImAccountStore();
const imMessageStore = useImMessageStore();
const msgListScrollStore = useMsgListScrollStore();

// 更新对应session信息
async function updateSessionInfo(sessionArr, setMsgReceipt) {
  // 会话排序
  for (const session of sessionArr) {
    imAccountStore.setSessionMap(session)
  }
  let orderSessions = computed(() => imAccountStore.getSessionMapList())

  let unread = 0;
  for (let i = 0; i < orderSessions.value.length; i++) {
    setTimeout(() => {
      updateAccountInfo(orderSessions.value[i]);
      if (orderSessions.value[i].scene === 'p2p' && setMsgReceipt) markMsgReceived(orderSessions.value[i]);
    }, i * 100)
    unread += orderSessions.value[i].unread
  }

  imMessageStore.setImUnreadCount(unread);

  if (window.electronAPI) {
    await window.electronAPI.setUnreadCount(imMessageStore.imUnreadCount);
  }
}

// 更新im账户信息
function updateAccountInfo (session) {
  if (session.scene === "p2p" && !imAccountStore.imUserProfiles[session.to]) {
    fetchUserInfo(session.to)
  }
}

// 接收im消息
const onMsgText = async (msg) => {
  const isMainWinVisible = await window.electronAPI.checkWindowVisibility();
  addMsgToMsgArr(msg);
  // 如果窗口处于不可见
  if (!isMainWinVisible) {
    return;
  }
  // 窗口可见状态下发送方非本身并且处于当前会话状态，则发送已读回执
  if (imAccountStore.imActiveSession.to && imAccountStore.imActiveSession.to === msg.from && msg.scene === 'p2p' && isMainWinVisible) {
    sendMsgReceipt(msg);
  }
  msgListScrollStore.setIsToBottom(true);
}

// 接收提示消息
const notification = (msg) => {
  console.log(msg)
}

// im初始化
function imInit (appKey) {
  initializeNim(appKey, {
    onconnect: (data) => { console.log('连接成功', data) },
    onwillreconnect: (obj) => {
      console.log('即将重连')
      console.log(obj.retryCount)
      console.log(obj.duration)
    },
    ondisconnect: (error) => {
      // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
      console.log('丢失连接');
      console.log(error);
      imAccountStore.setAccount({});
      ElNotification({
        title: 'Error',
        message: '用户名或密码错误, 请检查appKey和token是否有效, account和token是否匹配',
        type: 'error'
      });
    },
    onerror: (error) => {
      console.log('连接错误')
      console.log(error)
    },
    onsessions: (sessionArr) => {
      updateSessionInfo(sessionArr, true);
    },
    onupdatesessions: (sessionArr) => {
      console.log('onupdatesessions=====', sessionArr);
      updateSessionInfo(sessionArr, true);
    },
    onmsg: (msg) => {
      switch (msg.type) {
        case 'text':
          onMsgText(msg)
          break
        case 'image':
          onMsgText(msg)
          break
        case 'file':
          onMsgText(msg)
          break
        case 'audio':
          onMsgText(msg)
          break
        case 'video':
          onMsgText(msg)
          break
        case 'custom':
          /**
           * 收到自定义消息，用户d根据消息内容处理
           */
          onMsgText(msg)
          break
        case 'notification':
          /**
           * 收到群通知消息，用户根据群通知的消息进行进一步处理
           */
          onMsgText(msg)
          notification(msg)
          break
        // 其它case
        default:
          break
      }
    },
    onMsgReceipts: (data) => {
      console.log('已读回执', data)
    },
    onupdatemyinfo: (profile) => {
      console.log('当前账号信息更新', profile)
    },
    onsyncdone: () => {
      console.log('初始化同步完成');
      window.electronAPI.setLoginState({ appKey:appKey.value, user: user.value, pwd: pwd.value });
      router.push('/');
    }
  })
}

//登录
const login = () => {
  if (appKey.value && user.value && pwd.value && window.electronAPI) {
    imAccountStore.setAccount({ im_accid: user.value, im_token: pwd.value })
      .then(() => {
        imInit(appKey.value);
      });
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-box">
      <el-input v-model="appKey" style="max-width: 6rem; margin-bottom: .2rem">
        <template #prepend>appKey:</template>
      </el-input>
      <el-input v-model="user" style="max-width: 6rem; margin-bottom: .2rem">
        <template #prepend>账号:</template>
      </el-input>
      <el-input v-model="pwd" style="max-width: 6rem; margin-bottom: .2rem">
        <template #prepend>密码:</template>
      </el-input>
      <el-button type="primary" @click="login">登录</el-button>
    </div>
  </div>
</template>

<style>
.login-view {
  display: flex;
  justify-content: center;
}
.login-box {
  display: flex;
  flex-direction: column;
  margin-top: 1.3rem;
}
</style>
