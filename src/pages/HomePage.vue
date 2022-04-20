<template>
  <q-page padding>
    <div>
      <q-card dark class="bg-blue q-px-md">
        <q-card-section>
          <div class="text-subtitle1">Total Users</div>
          <div class="text-h5">
            <q-icon class="q-mr-sm" size="md" name="groups" /> {{ usersCount }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
// Main Imports
import { computed, onBeforeMount } from "vue";

// Import Components
// Import Composables
// Import Stores
import { useUserStore } from "src/stores/users";
// Define Stores and COmposables
const userStore = useUserStore();
// Methods, Refs and States
const usersCount = computed(() => userStore.users.length);
onBeforeMount(() => userStore.getUsers());
</script>
