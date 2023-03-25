<template>
  <div>
    <!-- Welcome -->
    <div class="text-center">
      <h1>Welcome to {{ $config.public.appName }}</h1>
    </div>
    <Chat />
  </div>
</template>

<script lang="ts" setup>
import Chat from "@/components/Chat/index.vue";

definePageMeta({
  title: "Home",
  description: "Home page",
  keywords: "home, page",
});
</script>

<style lang="scss" scoped></style>
