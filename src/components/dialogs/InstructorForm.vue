<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px">
      <q-card-section class="text-h6"
        >{{ instructor ? "Edit" : "Add" }} Instructor</q-card-section
      >
      <q-card-section>
        <q-form @submit="instructor ? update() : save()" class="q-gutter-y-md">
          <q-input
            v-model="insData.name"
            placeholder="Full name"
            :rules="[(val) => !!val || 'Full name is required!']"
          />
          <q-select
            v-model="insData.college"
            outlined
            hint="College department"
            :options="['CCS', 'CTE', 'CCJE', 'CAF', 'CBA']"
            :rules="[(val) => !!val || 'College department is required!']"
          />
          <q-card-actions align="right" class="q-gutter-x-sm">
            <q-btn
              type="submit"
              no-caps
              flat
              :label="instructor ? 'Update' : 'Save'"
            />
            <q-btn no-caps flat label="Cancel" color="negative" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive } from "vue";
import { useDialogPluginComponent } from "quasar";
import { schedStore } from "stores/scheduler";

defineEmits([...useDialogPluginComponent.emits]);

const insData = reactive({
  id: "",
  name: "",
  college: "",
});

const props = defineProps({
  instructor: Object,
});

if (props.instructor) {
  Object.assign(insData, props.instructor);
}

const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
  useDialogPluginComponent();

const save = async () => {
  const res = await schedStore().addInstructor({ ...insData });
  if (res) onDialogOK();
};

const update = async () => {
  const res = await schedStore().updateData(insData.id, "instructors", {
    ...insData,
  });
  if (res) onDialogOK();
};
</script>
