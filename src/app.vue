<template>
  <div class="mainContainer flex flex-column">
    <Header />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import Header from "@/layouts/Header.vue";
import BottomNav from "@/layouts/BottomNav.vue";
</script>
