<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section>{{ workload ? "Edit" : "Add" }} workload</q-card-section>
      <q-card-section>
        <q-form @submit="workload ? update() : save()" class="q-gutter-y-sm">
          <!-- Instructor -->
          <q-select
            v-model="workdloadData.instructorId"
            use-input
            dense
            outlined
            input-debounce="0"
            hint="Instructor"
            :options="insOptions"
            :option-label="(val) => (val === null ? null : val.name)"
            option-value="id"
            emit-value
            map-options
            @filter="filterIns"
            :rules="[(val) => !!val || 'Instructor is required!']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Subject -->
          <q-select
            dense
            outlined
            v-model="workdloadData.subjectId"
            use-input
            input-debounce="0"
            hint="Subject"
            :options="subOptions"
            :option-label="(val) => (val === null ? null : val.code)"
            option-value="id"
            emit-value
            map-options
            @filter="filterSub"
            @update:model-value="(val) => getDesc(val)"
            :rules="[(val) => !!val || 'Subject is required!']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="workdloadData.desc"
            dense
            hint="Description"
            readonly
          />

          <!-- Courses and Section -->
          <q-select
            v-model="workdloadData.courseId"
            dense
            outlined
            use-input
            input-debounce="0"
            hint="Course & Section"
            :options="courseOptions"
            :option-label="(val) => (val === null ? null : val.name)"
            option-value="id"
            emit-value
            map-options
            @filter="filterCourse"
            :rules="[(val) => !!val || 'Course & section is required!']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div class="row items-start q-gutter-x-xs">
            <div class="form-control">
              <q-input
                dense
                outlined
                v-model="workdloadData.units"
                hint="Units"
                mask="#"
                :rules="[(val) => !!val || 'Field is required!']"
              />
            </div>
            <div class="form-control">
              <q-input
                dense
                outlined
                v-model="workdloadData.lec"
                hint="Lec"
                mask="#"
                :rules="[(val) => !!val || 'Field is required!']"
              />
            </div>

            <div class="form-control">
              <q-input
                dense
                outlined
                v-model="workdloadData.lab"
                hint="Lab"
                mask="#"
                :rules="[(val) => !!val || 'Field is required!']"
              />
            </div>

            <div class="form-control">
              <q-input
                dense
                outlined
                :model-value="getTotalHours()"
                hint="Total hours"
                readonly
              />
            </div>
          </div>
          <q-card-actions align="right">
            <q-btn no-caps color="dark" v-close-popup label="Cancel" />
            <q-btn
              type="submit"
              no-caps
              color="primary"
              :label="workload ? 'Update' : 'Save'"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="sass" scoped>
.form-control
  max-width: 80px
</style>

<script setup>
import { useDialogPluginComponent } from "quasar";
import { computed, reactive, ref } from "vue";
import { schedStore } from "stores/scheduler";
import { workloadStore } from "stores/workloads";

defineEmits([...useDialogPluginComponent.emits]);
defineProps({
  workload: Object,
});
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

async function save() {
  const res = await workloadStore().addWorkload({ ...workdloadData });
  if (res) onDialogOK();
}

async function update() {
  const res = await workloadStore().addWorkload({ ...workdloadData });
  if (res) onDialogOK();
}

function getDesc(val) {
  const i = subjects.value.findIndex((item) => item.id == val);
  workdloadData.desc = subjects.value[i].desc;
}

const workdloadData = reactive({
  id: "",
  instructorId: "",
  subjectId: "",
  desc: "",
  courseId: "",
  units: null,
  lec: 0,
  lab: 0,
  totalHours: null,
});

function getTotalHours() {
  const total = parseInt(workdloadData.lec) + parseInt(workdloadData.lab);
  workdloadData.totalHours = total;
  return total;
}

const subjects = computed(() => schedStore().subjects);
const subOptions = ref(subjects.value);
const filterSub = (val, update) => {
  if (val === "") {
    update(() => {
      subOptions.value = subjects.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    subOptions.value = subjects.value.filter(
      (v) => v.code.toLowerCase().indexOf(needle) > -1
    );
  });
};

const courses = computed(() => schedStore().courses);
const courseOptions = ref(courses.value);
const filterCourse = (val, update) => {
  if (val === "") {
    update(() => {
      courseOptions.value = courses.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    courseOptions.value = courses.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const instructors = computed(() => schedStore().instructors);
const insOptions = ref(instructors.value);
const filterIns = (val, update) => {
  if (val === "") {
    update(() => {
      insOptions.value = instructors.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    insOptions.value = instructors.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>
