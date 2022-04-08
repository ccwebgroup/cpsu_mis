<template>
  <q-page padding
    ><q-card style="max-width: 600px" class="q-mx-auto">
      <q-card-section>
        <qr-stream @decode="onDecode"></qr-stream>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

// Import Stores
import { useVaxLogStore } from "src/stores/vaccination-logs";
// Define Stores
const vaxLogStore = useVaxLogStore();

const result = ref("");
const onDecode = (data) => {
  result.value = data;
  vaxLogStore.addVaxLog({ id: data });
};
</script>
