<template>
  <q-card dark>
    <q-card-section>
      <q-item dense>
        <q-item-section avatar>
          <q-icon name="launch" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <a class="text-white text-caption" :href="url">{{ url }}</a>
          </q-item-label>
        </q-item-section>
      </q-item>
      <div class="text-subtitle1"></div>
    </q-card-section>
  </q-card>
</template>
<script setup>
const props = defineProps({ url: String });
</script>
