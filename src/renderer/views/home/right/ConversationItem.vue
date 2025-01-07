<script setup>
import Avatar from "@/views/home/Avatar.vue";
import { formatTimestampToTime } from "@/utils/nim";
import { useImAccountStore } from "@/stores/imAccountStore";
import { computed } from "vue";
import { ElBadge } from "element-plus";
import 'element-plus/es/components/badge/style/css';

const props = defineProps({
  session: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const imAccountStore = useImAccountStore();
const lastMsgTime = props.session.lastMsg ? formatTimestampToTime(props.session.lastMsg.time) : '';
const displayName = computed(() => {
  if (props.session.scene === 'p2p') {
    return imAccountStore.imUserProfiles[props.session.to] && imAccountStore.imUserProfiles[props.session.to].nick ? imAccountStore.imUserProfiles[props.session.to].nick : props.session.to
  } else {
    return ''
  }
});
const avatar = computed(() => {
  if (props.session.scene === 'p2p') {
    return imAccountStore.imUserProfiles[props.session.to] && imAccountStore.imUserProfiles[props.session.to].avatar ? imAccountStore.imUserProfiles[props.session.to].avatar : ''
  } else {
    return ''
  }
});
const lastMsgText = computed(() => {
  let text = '\u00A0'
  if (!props.session.lastMsg) return text
  if (props.session.lastMsg.type === 'text') {
    text = props.session.lastMsg.text
  } else if (props.session.lastMsg.type === 'image') {
    text = '[图片消息]'
  } else if (props.session.lastMsg.type === 'file' && props.session.lastMsg.file) {
    text = '[文件]'
  } else if (props.session.lastMsg.type === 'audio' && props.session.lastMsg.file) {
    text = '[音频]'
  } else if (props.session.lastMsg.type === 'video' && props.session.lastMsg.file) {
    text = '[视频]'
  } else if (props.session.lastMsg.type === 'notification') {
    text = '[通知]'
  } else if (props.session.lastMsg.type === 'custom') {
    text = '[自定义消息]'
  }

  return text;
});

const activeClass = computed(() => {
  return props.isActive ? 'active' : ''
})

const emit = defineEmits(['activeChange']);

const handleActive = () => {
  emit('activeChange', props.session)
}
</script>

<template>
  <div class="conversation-warp">
    <div class="conversation" :class="activeClass" @click="handleActive">
      <el-badge v-if="session.unread && session.unread !== 0" :value="session.unread" class="item">
        <avatar :avatar="avatar" />
      </el-badge>
      <avatar v-else :avatar="avatar" />
      <div class="conversation-content">
        <div class="conversation-content-name">{{ displayName }}</div>
        <div class="conversation-content-msg">
          <div class="conversation-content-msg-body">
            <span>{{ lastMsgText }}</span>
          </div>
        </div>
      </div>
      <div class="conversation-state">
        <div class="conversation-item-state-date">{{ lastMsgTime }}</div>
      </div>
    </div>
  </div>
</template>

<style>
.conversation {
  display: flex;
  padding: .24rem;
  gap: .2rem;
}
.conversation-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  line-height: normal;
}
.conversation-content-name {
  font-size: .28rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conversation-content-msg-body {
  font-size: .24rem;
  color: #999999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conversation-item-state-date {
  font-size: .24rem;
  color: #999999;
}
.active {
  background-color: #ccc;
}
</style>
