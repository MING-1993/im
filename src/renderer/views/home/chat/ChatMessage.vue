<script setup>
import { useImAccountStore } from "@/stores/imAccountStore";
import { useImMessageStore } from "@/stores/imMessageStore";
import { formatTimestampToTime } from "@/utils/nim";
import { computed } from "vue";
import { ElImage } from "element-plus";
import 'element-plus/es/components/image/style/css';
import Avatar from "@/views/home/Avatar.vue";
import checkSvg from '@/assets/image/check.svg?raw';
import fileSvg from '@/assets/image/file.svg';
import qyhJpg from '@/assets/image/qyh.jpg';

const imMessageStore = useImMessageStore();
const imAccountStore = useImAccountStore();

const imMessages = computed(() => {
  return imMessageStore.imSessionMsg[imAccountStore.imActiveSession.id] ? imMessageStore.imSessionMsg[imAccountStore.imActiveSession.id].msgArr : [];
})

const avatar = (from) => {
  if (from === imAccountStore.imAccount.im_accid) {
    return imAccountStore.imAccount.im_icon ? imAccountStore.imAccount.im_icon : '';
  } else {
    return imAccountStore.imUserProfiles[imAccountStore.imActiveSession.to] && imAccountStore.imUserProfiles[imAccountStore.imActiveSession.to].avatar ? imAccountStore.imUserProfiles[imAccountStore.imActiveSession.to].avatar : '';
  }
}

// 文件下载
const loadFile = (msg) => {
  console.log('下载==')
  const fileUrl = msg.file ? msg.file.url : msg.payload.url;
  window.electronAPI.downloadFile(fileUrl);
}
</script>

<template>
  <div class="chat-message-list-content">
    <div v-for="(msg, index) in imMessages" :key="index">
      <div class="chat-message-list-item-wrap" :class="msg.from === imAccountStore.imAccount.im_accid ? 'chat-message-list-item-self' : 'chat-message-list-item-not-self'">
        <div class="chat-message-list-item-avatar">
          <Avatar :avatar="avatar(msg.from)" />
        </div>
        <div class="chat-message-list-item-content-box">
          <div class="chat-message-list-item-nick">{{ msg.fromNick ? msg.fromNick : msg.from }}</div>
          <div class="chat-message-list-item-content">
            <div class="chat-message-list-item-status" v-if="msg.from === imAccountStore.imAccount.im_accid && msg.scene !== 'team'">
              <div class="common-percent-wrap">
                <div v-if="msg.readByOtherUser" v-html="checkSvg" class="common-percent-wrap-svg ht-svg"></div>
                <svg v-else class="common-percent-wrap-svg" width="16" height="16" viewBox="0 0 16 16">
                  <circle class="common-percent-wrap-svg-bg" r="7" cx="8" cy="8" stroke-width="1.5"></circle>
                  <circle class="common-percent-wrap-svg-content" r="4" cx="8" cy="8" fill="transparent" stroke-width="8" stroke-dasharray="calc(0 * 8 * 3.14 / 100) calc(8 * 3.14)" transform="rotate(-90 8 8)"></circle>
                </svg>
              </div>
            </div>
            <div class="chat-message-list-item-body">
              <div v-if="msg.type === 'text'" class="common-parse-session-text-wrapper">{{ msg.text }}</div>
              <div v-else-if="msg.type === 'image'">
                <el-image class="m-image-img" fit="cover" :src="msg.file ? msg.file.url : msg.payload.url" :preview-src-list="[msg.file ? msg.file.url : msg.payload.url]" lazy>
                  <template #placeholder>
                    <img :src="qyhJpg" alt="">
                  </template>
                </el-image>
              </div>
              <div v-else-if="msg.type === 'file' || msg.type === 'audio'" class="common-parse-session-file-box" @click="loadFile(msg)">
                <div class="common-parse-session-file-info">
                  <span>{{ msg.file ? msg.file.name : msg.payload.name }}</span>
                  <span class="file-size">{{ msg.file ? msg.file.size : msg.payload.size }}B</span>
                </div>
                <span class="m-icon common-parse-session-file-icon">
                  <img :src="fileSvg" alt="">
                </span>
              </div>
            </div>
          </div>
          <div class="chat-message-list-item-date" :class="msg.from === imAccountStore.imAccount.im_accid ? 'chat-message-list-item-date-self' : ''">{{ formatTimestampToTime(msg.time) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.chat-message-list-item-wrap {
  display: flex;
  padding: 8px;
}
.chat-message-list-item-wrap .chat-message-list-item-content-box {
  line-height: 1.5;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.chat-message-list-item-self .chat-message-list-item-content-box {
  align-items: flex-end;
}
.chat-message-list-item-self {
  flex-direction: row-reverse;
}
.chat-message-list-item-self .chat-message-list-item-avatar {
  margin-left: 12px;
  margin-right: 0;
}
.chat-message-list-item-not-self .chat-message-list-item-avatar {
  margin-left: 0;
  margin-right: 12px;
}
.chat-message-list-item-not-self .chat-message-list-item-content {
  flex-direction: row-reverse;
}
.chat-message-list-item-wrap .chat-message-list-item-content-box .chat-message-list-item-nick {
  color: #666666;
}
.chat-message-list-item-wrap .chat-message-list-item-content-box .chat-message-list-item-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-message-list-item-wrap .chat-message-list-item-content-box .chat-message-list-item-body {
  word-break: break-all;
  word-wrap: break-word;
  white-space: break-spaces;
  line-height: 22px;
  overflow: hidden;
  max-width: 442px;
  min-width: 50px;
  border-radius: 5px;
  background: #fff;
}
.chat-message-list-item-self .chat-message-list-item-content-box .chat-message-list-item-body {
  background: #d6e5f6;
  border-radius: 12px 0 12px 12px;
}
.common-parse-session-text-wrapper {
  padding: 12px 16px;
}
.chat-message-list-item-wrap .chat-message-list-item-date {
  padding-top: 4px;
  font-size: 12px;
  color: #999999;
  text-align: left;
}
.chat-message-list-item-wrap .chat-message-list-item-date-self {
  text-align: right;
}
.chat-message-list-item-wrap .chat-message-list-item-status {
  padding-right: .16rem;
}
.common-percent-wrap {
  display: flex;
  align-items: center;
}
.common-percent-wrap-svg {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.common-percent-wrap-svg-bg {
  fill: #ffffff;
  stroke: #537ff4;
}
.common-percent-wrap-svg-content {
  stroke: #537ff4;
}
.ht-svg {
  width: 16px;
  height: 16px;
}
.ht-svg svg {
  fill: none;
}
.ht-svg svg circle {
  stroke: #537ff4; /* 设置圆形的描边颜色 */
}

.ht-svg svg path {
  stroke: #537ff4; /* 设置对号的颜色 */
}
.m-image-img {
  width: 6rem;
  height: 6rem;
  object-fit: cover;
  vertical-align: middle;
}
.common-parse-session-file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
}
.common-parse-session-file-box .common-parse-session-file-info {
  padding-right: 16px;
  display: flex;
  flex-direction: column;
}
.file-size {
  font-size: 12px;
  color: #999;
  line-height: normal;
}
.m-icon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizelegibility;
}
.common-parse-session-file-box .common-parse-session-file-icon {
  font-size: 32px;
}
</style>
