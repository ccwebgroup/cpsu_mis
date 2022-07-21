<template>
  <q-page padding class="bg-grey-2">
    <q-item-label class="text-h6 q-mb-sm">Workload </q-item-label>
    <q-card>
      <q-card-actions align="right">
        <q-btn
          @click="handleDialog(null)"
          flat
          icon="add"
          label="Workload"
          no-caps
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { schedStore } from "stores/scheduler";
import WorkLoadForm from "components/dialogs/WorkLoadForm.vue";

const $q = useQuasar();

function handleDialog(data) {
  $q.dialog({
    component: WorkLoadForm,
    componentProps: {
      workdload: data,
    },
  });
}

handleDialog();

const getData = () => schedStore().getAllData();
getData();
</script>
