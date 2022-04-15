<template>
  <router-view />
</template>

<script setup>
import { onBeforeMount, computed, provide } from "vue";
import { useAuthStore } from "src/stores/auth";
const authStore = useAuthStore();

const authUser = computed(() => authStore.authUser);
onBeforeMount(() => authStore.handleAuthState());
provide("authUser", authUser);
</script>
