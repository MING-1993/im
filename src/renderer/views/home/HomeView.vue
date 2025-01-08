<script setup>
import { onMounted, computed, ref } from 'vue';
import { ElNotification } from "element-plus";
import 'element-plus/es/components/notification/style/css';
import { useImAccountStore } from "@/stores/imAccountStore";
import { resetCurrSession, imActiveSessionChange } from "@/utils/nim";
import LeftSidebar from "@/views/home/LeftSidebar.vue";
import Right from "@/views/home/right/Right.vue";

const imAccountStore = useImAccountStore();

// 检查窗口状态
const isActiveSession = computed(() => Object.keys(imAccountStore.imActiveSession).length > 0);
const checkWindowStatus = async () => {
  isWindowVisible.value = await window.electronAPI.checkWindowVisibility();
};
const isWindowVisible = ref(false);
onMounted(async () => {
  if (window.electronAPI) {
    // 监听更新可用事件
    window.electronAPI.onUpdateAvailable(() => {
      ElNotification({
        title: '更新提示',
        message: '新版本可用！正在下载...',
        type: 'info'
      });
    });
    // 监听更新已下载事件
    window.electronAPI.onUpdateDownloaded(() => {
      if (confirm('更新已下载，是否立即安装？')) {
        window.electronAPI.installUpdate();  // 触发安装更新
      }
    });

    // 监听主窗口显示/隐藏事件
    await checkWindowStatus();
    window.electronAPI.onWindowVisibilityChanged((isVisible) => {
      isWindowVisible.value = isVisible;
      if (!isVisible && isActiveSession.value) {
        resetCurrSession(imAccountStore.imActiveSession);
      } else if (isVisible && isActiveSession.value) {
        imActiveSessionChange(imAccountStore.imSessionMap[imAccountStore.imActiveSession.id], false)
      }
    });
  }
});
</script>

<template>
  <div class="home">
    <left-sidebar />
    <right />
  </div>
</template>

<style>
.home {
  font-family: Arial, sans-serif;
  display: flex;
  height: 100%;
  user-select: none;
  background-color: #f3f3f3;
}
</style>
