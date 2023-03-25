<template>
  <div class="p-2 chat-wrapper" v-if="chat">
    <Message v-for="message in chat.messages" :message="message" />
    <div v-show="chat.loading">Loading ...</div>
    <form @submit.prevent="submit(newMessage)">
      <textarea v-model="newMessage" placeholder="Type your message here" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import Message from "./Message.vue";

const { chat, submit } = await useChat(0);

const newMessage = ref("");
</script>

<style lang="scss" scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  textarea {
    width: 300px;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
}
</style>
