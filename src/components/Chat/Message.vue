<template>
  <div :style="{ 'align-items': message.role === 'user' ? 'start' : 'end' }">
    <div>
      <h4>{{ message.role }}:</h4>
      <Content :content="message.content" />
    </div>
    <!-- <pre>{{ message }}</pre> -->
  </div>
</template>

<script lang="ts" setup>
import Content from "./MessageContent.vue";

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
