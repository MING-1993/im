import { useImAccountStore } from "@/stores/imAccountStore";
import { useNimStore } from "@/stores/nim";
import { useImMessageStore } from "@/stores/imMessageStore";
import { useMsgListScrollStore } from "@/stores/msgListScrollStore";
import SDK from "@yxim/nim-web-sdk";

// im初始化
export function initializeNim (appKey, callbacks) {
  const imAccountStore = useImAccountStore();
  const nimStore = useNimStore();

  const nim = SDK.NIM.getInstance({
    debug: false,
    syncSessionUnread: true,
    syncMsgReceipts: true,
    appKey: appKey,
    account: imAccountStore.imAccount.im_accid || '',
    token: imAccountStore.imAccount.im_token || '',
    ...callbacks,
  });

  nimStore.setNimInstance(nim);
}

// 获取im账号信息
export function fetchUserInfo (account) {
  const nimStore = useNimStore();
  const nim = nimStore.nim;
  const imAccountStore = useImAccountStore();

  nim.getUser({
    account,
    sync: true,
    done: (err, user) => {
      if (err) {
        console.error('获取用户信息失败', err)
      } else {
        imAccountStore.setImUserProfiles(user);
      }
    }
  })
}

// 加载消息记录
export function loadMoreMsgOfSession (scene, to, limit) {
  const imSessionStore = useImMessageStore();
  const sessionId = `${scene}-${to}`;
  const sessionMsg = imSessionStore.imSessionMsg[sessionId] || {
    msgArr: [],
    fetching: false,
    complete: false
  };

  console.log('imSessionStore=====', sessionMsg);
  // console.log('sessionMsg', sessionMsg.msgArr[0]);

  const params = {
    asc: false,
    scene: scene,
    to: to,
    beginTime: 0,
    limit: limit,
    endTime: sessionMsg.msgArr[0] ? sessionMsg.msgArr[0].time : 0,
    reverse: false, // 从endTime开始往前查询
    done: (err, data) => {
      console.log(data)
      if (err) {
        console.log('loadMoreMsgOfSession Error：', err);
        return;
      } else if (data && data.msgs && data.msgs.length > 0) {
        sessionMsg.msgArr.unshift(...data.msgs.reverse());
        // 拉取的消息长度 < 分页长度，因此 complete = true
        if (data.msgs.length < limit) {
          sessionMsg.complete = true;
        }
      } else {
        sessionMsg.complete = true;
      }

      // 更新store
      imSessionStore.setSessionMsg(sessionId, sessionMsg);
      console.log(`当前会话: ${sessionId} 的历史消息为`, imSessionStore.imSessionMsg[sessionId]);
    }
  };

  const nimStore = useNimStore();
  const nim = nimStore.nim;
  nim.getHistoryMsgs(params);
}

// 切换会话对象
export function imActiveSessionChange (session, loadMsg) {
  const imSessionStore = useImAccountStore();
  if (session.unread > 0) {
    const imMessageStore = useImMessageStore();
    imMessageStore.setImUnreadCount(imMessageStore.imUnreadCount - session.unread);
    if (session.lastMsg && session.lastMsg.scene === 'p2p' && (session.lastMsg.from !== imSessionStore.imAccount)) {
      sendMsgReceipt(session.lastMsg);
    }
  }
  imSessionStore.setImActiveSession(session);
  setCurrSession(session);

  if (loadMsg) {
    loadMoreMsgOfSession(session.scene, session.to, 30);
  }
  const msgListScrollStore = useMsgListScrollStore();
  setTimeout(() => {
    msgListScrollStore.setIsToBottom(true);
  }, 100);
}

// 进入会话的界面后，调用该函数，设置会话的未读数为0。同时，如果有新消息到来的话，会话未读数会保持为0
export function setCurrSession (session) {
  const nimStore = useNimStore();
  const nim = nimStore.nim;
  nim.setCurrSession(session.id);
}

// 退出会话后，调用该接口取消设置当前会话。这样，有新消息到来时，会话未读数会更新
export function resetCurrSession (session) {
  const nimStore = useNimStore();
  const nim = nimStore.nim;
  nim.resetCurrSession(session.id);
}

// 发送已读回执
export function sendMsgReceipt (lastMsg) {
  const nimStore = useNimStore();
  const nim = nimStore.nim;
  nim.sendMsgReceipt({
    msg: lastMsg,
    done: (error, obj) => {
      console.log('发送消息已读回执' + (!error?'成功':'失败'), error, obj);
    }
  })
}

// 将接收的消息插入进消息数组
export function addMsgToMsgArr (msg) {
  const imSessionStore = useImMessageStore();
  const sessionMsg = imSessionStore.imSessionMsg[msg.sessionId] || {
    msgArr: [],
    fetching: false,
    complete: false
  };
  sessionMsg.msgArr.push(msg)
  imSessionStore.setSessionMsg(msg.sessionId, sessionMsg);
}

// 发送消息
export async function sendMessage (text) {
  return new Promise((resolve, reject) => {
    if (!text) {
      reject('消息不能为空');
      return;
    }

    const imAccountStore = useImAccountStore();
    const nimStore = useNimStore();
    const nim = nimStore.nim;
    const msg = nim.sendText({
      scene: imAccountStore.imActiveSession.scene,
      to: imAccountStore.imActiveSession.to,
      text: text,
      done: (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      }
    });
    addMsgToMsgArr(msg);
    const msgListScrollStore = useMsgListScrollStore();
    msgListScrollStore.setIsToBottom(true);
  })
}

// 发送文件
export function sendFile (domId, blobUrl, type, name, size, done) {
  const imAccountStore = useImAccountStore();
  const nimStore = useNimStore();
  const nim = nimStore.nim;

  // 创建 fileMsg 对象，初始化 payload
  const fileMsg = nim.sendFile({
    scene: imAccountStore.imActiveSession.scene,
    to: imAccountStore.imActiveSession.to,
    type: type,
    fileInput: domId,
    beforesend: (msg) => {
      console.log('正在发送文件消息', msg);
    },
    uploadprogress: (data) => {
      console.log('上传进度: ' + data.percentage);
      fileMsg.payload = {
        progress: data.percentage,
        uploadDone: false,
        url: blobUrl,
        name: name,
        size: size
      }
    },
    uploaddone: (error, file) => {
      console.log('uploaddone', file)
      console.log('上传' + (!error?'成功':'失败'))
      if (!error) {
        fileMsg.payload = {
          progress: 100,
          uploadDone: true,
          url: blobUrl,
          name: name,
          size: size
        }
      }
    },
    done: done
  });

  fileMsg.payload = {
    progress: 0,
    uploadDone: false,
    url: blobUrl,
    name: name,
    size: size
  };

  addMsgToMsgArr(fileMsg);
  const msgListScrollStore = useMsgListScrollStore();
  msgListScrollStore.setIsToBottom(true);
}

// 标记消息已读状态
export function markMsgReceived (session) {
  const imSessionStore = useImMessageStore();
  const imAccountStore = useImAccountStore();
  const sessionMsgReceiptTime = session.msgReceiptTime;

  setTimeout(() => {
    if (imSessionStore.imSessionMsg[session.id] && sessionMsgReceiptTime) {
      const sessionMsgArr = imSessionStore.imSessionMsg[session.id];
      for (let i = 0; i < sessionMsgArr.msgArr.length; i++) {
        const msg = sessionMsgArr.msgArr[i];
        if (msg.from === imAccountStore.imAccount.im_accid && msg.to !== imAccountStore.imAccount.im_accid) {
          // 消息时间早于等于已读回执时间
          if (!msg.readByOtherUser && msg.time <= sessionMsgReceiptTime) {
            const updatedMsg = { ...msg, readByOtherUser: true };
            sessionMsgArr.msgArr.splice(i, 1, updatedMsg); // 替换对象
          }
        }
      }
      imSessionStore.setSessionMsg(session.id, sessionMsgArr);
    }
  }, 500);
}

export function formatTimestampToTime (timestamp) {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}
