import { defineStore } from "pinia";
import { ref } from "vue";

export const useNimStore = defineStore('nimStore', () => {
  const nim = ref(null);

  // 设置 NIM 实例
  const setNimInstance = (instance) => {
    nim.value = instance
  }

  const clearNimInstance = () => {
    if (nim.value) {
      nim.value.destroy({})
    }
    nim.value = null
  }

  return { nim, setNimInstance, clearNimInstance }
})
