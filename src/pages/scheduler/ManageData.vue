<template>
  <q-page padding class="bg-grey-1">
    <div class="q-pa-md text-h6">Manage Data</div>
    <div class="q-gutter-y-md">
      <!-- Subjects -->
      <q-card>
        <q-card-section class="row justify-between">
          <div class="col">
            <div class="text-subtitle1">Subjects</div>
          </div>
          <div class="col">
            <q-btn
              @click="handleSubjDialog(null)"
              flat
              no-caps
              icon="add"
              label="New Subject"
              color="primary"
            />
          </div>
        </q-card-section>

        <q-card-section>
          <q-table dense flat :columns="subCols" :rows="subjects">
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  @click="handleSubjDialog(props.row)"
                  flat
                  size="sm"
                  round
                  icon="edit"
                  color="positive"
                />
                <q-btn
                  @click="deleteData(props.row.id, 'subjects')"
                  flat
                  size="sm"
                  round
                  icon="delete"
                  color="negative"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
      <!-- Course -->
      <q-card>
        <q-card-section class="row justify-between">
          <div class="col">
            <div class="text-subtitle1">Courses</div>
          </div>
          <div class="col">
            <q-btn
              @click="handleCourseDialog(null)"
              flat
              no-caps
              icon="add"
              label="New Class"
              color="primary"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-table dense flat :rows="courses" :columns="courseCols">
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  @click="deleteData(props.row.id, 'courses')"
                  flat
                  size="sm"
                  round
                  icon="delete"
                  color="negative"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
      <!-- Instructors -->
      <q-card>
        <q-card-section class="row justify-between">
          <div class="col">
            <div class="text-subtitle1">Instructors</div>
          </div>
          <div class="col">
            <q-btn
              @click="handleInsDialog(null)"
              flat
              no-caps
              icon="add"
              label="New Instructor"
              color="primary"
            />
          </div>
        </q-card-section>

        <q-card-section>
          <q-table dense flat :rows="instructors" :columns="insCols">
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  @click="handleInsDialog(props.row)"
                  flat
                  size="sm"
                  round
                  icon="edit"
                  color="positive"
                />
                <q-btn
                  @click="deleteData(props.row.id, 'instructors')"
                  flat
                  size="sm"
                  round
                  icon="delete"
                  color="negative"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
      <!-- Rooms -->
      <q-card>
        <q-card-section>
          <div class="row justify-between q-mb-md">
            <div class="col">
              <div class="text-subtitle1">Rooms</div>
            </div>
            <div class="col">
              <q-input
                dense
                v-model="roomName"
                outlined
                placeholder="Room name"
              >
                <template v-slot:after>
                  <q-btn @click="addRoom" round flat icon="add" />
                </template>
              </q-input>
            </div>
          </div>
          <q-table dense flat :rows="rooms" :columns="roomCols">
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  @click="deleteData(props.row.id, 'rooms')"
                  flat
                  size="sm"
                  round
                  icon="delete"
                  color="negative"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import SubjectForm from "src/components/dialogs/SubjectForm.vue";
import CourseForm from "src/components/dialogs/CourseForm.vue";
import InstructorForm from "src/components/dialogs/InstructorForm";
import { computed, ref } from "vue";
import { schedStore } from "stores/scheduler";

const $q = useQuasar();
const roomName = ref("");

const subjects = computed(() => schedStore().subjects);
const courses = computed(() => schedStore().courses);
const instructors = computed(() => schedStore().instructors);
const rooms = computed(() => schedStore().rooms);

const deleteData = (id, cols) => schedStore().deleteData(id, cols);

const addRoom = async () => {
  const res = await schedStore().addRoom(roomName.value);
  if (res) roomName.value = "";
};

const handleSubjDialog = (val) => {
  $q.dialog({
    component: SubjectForm,
    componentProps: { subj: val },
  });
};

const handleCourseDialog = (val) => {
  $q.dialog({
    component: CourseForm,
    componentProps: { course: val },
  });
};

const handleInsDialog = (val) => {
  $q.dialog({
    component: InstructorForm,
    componentProps: { instructor: val },
  });
};

const getData = () => schedStore().getAllData();

getData();

const subCols = [
  { name: "code", label: "SUBJECT CODE", field: "code", align: "left" },
  { name: "desc", label: "SUBJECT DESCRIPTION", field: "desc", align: "left" },
  { name: "actions", label: "Actions", align: "left" },
];

const courseCols = [
  {
    name: "names",
    label: "COURSE",
    field: "name",
    align: "left",
  },
  { name: "actions", label: "Actions", align: "left" },
];

const insCols = [
  { name: "name", label: "NAME", field: "name", align: "left" },
  { name: "college", label: "COLLEGE", field: "college", align: "left" },
  { name: "id", label: "ID", field: "id", align: "left" },
  { name: "actions", label: "Actions", align: "left" },
];

const roomCols = [
  { name: "room", label: "NAME", field: "room", align: "left" },
  { name: "actions", label: "Actions", align: "left" },
];
</script>
