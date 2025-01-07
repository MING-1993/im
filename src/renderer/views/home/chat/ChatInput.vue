<script setup>
import { ref, nextTick } from 'vue';
import { sendMessage, sendFile } from "@/utils/nim";
import { ElPopover } from "element-plus";
import 'element-plus/es/components/popover/style/css';
import Emoji from "@/views/home/chat/Emoji.vue";
import smileSvg from '@/assets/image/smile.svg';
import folderSvg from '@/assets/image/folders.svg';

const chatInput = ref(null);
const showPopover = ref(false);
const msg = ref('');
const fileInput = ref(null);

// 选择表情
const selectEmoji = async (emoji) => {
  msg.value += emoji;
  showPopover.value = false;
  await nextTick(); // 等待 DOM 更新
  chatInput.value.focus();
}

// 发送消息
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (msg.value.trim() !== '') {
      sendMessage(msg.value).then(() => {
        msg.value = ''
      })
    }
  }
}

// 触发文件选择事件
const triggerFileInput = () => {
  fileInput.value.click();
}

// 选择并发送文件
const getFileType = (type) => {
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('audio/')) return 'audio'
  if (type.startsWith('video/')) return 'video'

  return 'file'
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
    const blobUrl = URL.createObjectURL(file);
    const fileType = getFileType(file.type);
    sendFile('fileInput', blobUrl, fileType, file.name, file.size, uploadDone);
  } else {
    console.log('选择文件失败')
  }
}

// 文件发送完成回调
const uploadDone = (err, msg) => {
  if (err) {
    console.log('发送失败', err)
  } else {
    console.log('发送消息成功，消息为: ', msg)
  }
}
</script>

<template>
  <div class="chat-message-input">
    <div class="chat-message-input-icon-box">
      <el-popover v-model:visible="showPopover" placement="top-start" width="200" trigger="click">
        <template #reference>
          <button type="button" class="m-btn m-btn-sm">
            <span role="img" tabindex="-1" class="chat-message-input-icon-emoji">
              <img :src="smileSvg" width="20" alt="">
            </span>
          </button>
        </template>
        <Emoji @select-emoji="selectEmoji" />
      </el-popover>
      <button type="button" class="m-btn m-btn-default m-btn-sm" @click="triggerFileInput">
        <input type="file" ref="fileInput" id="fileInput" style="display: none" @change="handleFileChange" />
        <span role="img" tabindex="-1" class="chat-message-input-icon-emoji">
          <img :src="folderSvg" width="20" alt="">
        </span>
      </button>
    </div>
    <div class="chat-message-input-wrap">
      <div class="chat-message-input-popup-container"></div>
      <div class="chat-message-input-content">
        <textarea v-model="msg" @keydown.enter="handleKeyDown" ref="chatInput" class="m-input chat-message-input-textarea" style="overflow-y: auto; height: 130px; resize: none; max-height: 150px;"></textarea>
      </div>
    </div>
  </div>
</template>

<style>
.chat-message-input {
  padding: 16px 16px 5px 16px;
  border-top: 1px solid #ded9d9;
}
.chat-message-input-wrap {
  position: relative;
  border-radius: 4px;
}
.chat-message-input-wrap .chat-message-input-popup-container {
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  bottom: 0;
}
.chat-message-input-wrap .chat-message-input-content {
  display: flex;
  position: relative;
}
.chat-message-input-wrap .chat-message-input-textarea {
  resize: none;
  line-height: 22px;
  border: none;
  outline: none;
  background-color: #f3f3f3;
}
.m-input {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 1.5715;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  transition: all 0.3s;
}
.m-input:placeholder-shown {
  text-overflow: ellipsis;
}
textarea.m-input {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  line-height: 1.5715;
  vertical-align: bottom;
  transition: all 0.3s, height 0s;
}
.chat-message-input-icon-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.m-btn {
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.85);
}
.chat-message-input-icon-box .m-btn {
  padding: 0;
  border: none;
  height: auto;
  margin-right: 12px;
  background: none;
}
.m-btn-sm {
  height: 24px;
  padding: 0 7px;
  font-size: 14px;
  border-radius: 2px;
}
.chat-message-input-icon-box .chat-message-input-icon-emoji {
  font-size: 20px;
}
</style>
