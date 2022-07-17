<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px">
      <q-card-section class="text-h6"
        >{{ course ? "Edit" : "Add" }} Class</q-card-section
      >
      <q-card-section>
        <q-form @submit="course ? update() : save()" class="q-gutter-y-md">
          <q-select
            v-model="courseData.course"
            outlined
            hint="Course"
            :options="courses"
            :rules="[(val) => !!val || 'Course is required!']"
          />
          <q-select
            v-model="courseData.year"
            outlined
            hint="Year"
            :options="['1', '2', '3', '4']"
            :rules="[(val) => !!val || 'Year is required!']"
          />
          <q-select
            v-model="courseData.section"
            outlined
            hint="Section"
            :options="['A', 'B', 'C', 'D', 'E']"
            :rules="[(val) => !!val || 'Section is required!']"
          />
          <q-card-actions align="right" class="q-gutter-x-sm">
            <q-btn
              type="submit"
              no-caps
              flat
              :label="course ? 'Update' : 'Save'"
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
defineProps({
  course: Object,
});
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
  useDialogPluginComponent();

const courseData = reactive({
  id: "",
  course: "",
  year: "",
  section: "",
});

const courses = [
  "BSIT",
  "BEED",
  "BSED (Math)",
  "BSED (BioSci)",
  "BSHM",
  "BSA",
  "BAS",
  "BSCRIM",
];

const save = async () => {
  const res = await schedStore().addCourse({ ...courseData });
  if (res) onDialogOK();
};

const update = async () => {
  const res = await schedStore().updateData(courseData.id, "courses", {
    ...courseData,
  });
  if (res) onDialogOK();
};
</script>
