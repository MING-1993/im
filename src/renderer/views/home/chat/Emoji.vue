<script setup>
import { ref } from "vue";
const emojis = ref([]);
emojis.value = [
  '😄',
  '😁',
  '😅',
  '😂',
  '🤣',
  '🫠',
  '😊',
  '😇',
  '🤪',
  '😜',
  '🫣',
  '🤫',
  '🤔',
  '🫡',
  '🤨',
  '😶',
  '😮‍💨',
  '😐',
  '🤥',
  '😌',
  '😔',
  '😪',
  '😴',
  '🤮',
  '🤧',
  '🥶',
  '😵‍💫',
  '😎',
  '😕',
  '😟',
  '🙁',
  '😳',
  '🥺',
  '😓',
  '😡',
  '👌',
  '🫰',
  '✌',
  '👍',
  '👎',
  '👏',
  '🤝',
  '🫶',
  '🙏',
  '🌹',
  '🌸',
  '🚀',
  '⛅',
  '🌧',
  '🏅',
  '🏆',
  '🇨🇳'
];

const emit = defineEmits(['selectEmoji']);
const handleClick = (emoji) => {
  emit('selectEmoji', emoji)
}
</script>

<template>
  <div class="emoji-warp">
    <div class="emojis">
      <span class="emoji" v-for="(emoji, index) in emojis" :key="index" @click="handleClick(emoji)">{{ emoji }}</span>
    </div>
  </div>
</template>

<style>
.emojis {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: .2rem;
  flex-wrap: wrap;
}
.emoji {
  cursor: pointer;
}
</style>
