<template>
  <q-page padding>
    <q-card>
      <q-card-actions class="q-pb-none q-pt-md" align="left">
        <q-btn
          padding="xs lg"
          no-caps
          @click="handlerDialogStudent"
          color="primary"
          rounded
          dense
          icon="add"
          label="Add Student"
        />
      </q-card-actions>

      <q-card-section class="q-pt-none">
        <q-table
          flat
          title="Students Vaccination Records"
          :rows="students"
          row-key="id"
          :filter="filter"
          :columns="studentCols"
          :loading="loading"
          :pagination="{ rowsPerPage: 15 }"
        >
          <template v-slot:top-right>
            <q-input
              dense
              rounded
              outlined
              debounce="500"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td>
                {{
                  `${props.row.lname}, ${props.row.fname} ${props.row.mname[0]}.`
                }}
              </q-td>
              <q-td>
                {{ props.row.vaccine }}
              </q-td>
              <q-td>
                {{ props.row.firstDose.date }}
              </q-td>
              <q-td>
                {{ props.row.secondDose.date }}
              </q-td>
              <q-td>
                <q-btn
                  @click="handleQrDialog(props.row)"
                  color="accent"
                  round
                  flat
                  icon="qr_code_2"
                />
                <q-btn
                  @click="handlerDialogStudent(props.row)"
                  color="info"
                  round
                  flat
                  icon="edit"
                />
                <q-btn
                  @click="remove(props.row.id)"
                  color="negative"
                  round
                  flat
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog
      v-model="qrDialog"
      transition-show="jump-in"
      transition-hide="jump-out"
    >
      <QrCode :studentData="studentData" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onBeforeMount, computed, ref } from "vue";
// Import Other Components
import AddEditStudent from "src/components/dialogs/AddEditStudent.vue";
import QrCodeDialog from "src/components/dialogs/QrCodeDialog.vue";
import QrCode from "/src/components/QrCode.vue";

import { useQuasar } from "quasar";
// Import Stores
import { useStudentStore } from "src/stores/students";
// Define Stores
const studentStore = useStudentStore();

const $q = useQuasar();

const filter = ref("");
const loading = ref(false);

const studentData = ref("");
const qrDialog = ref(false);

// Methods Sections
const handleQrDialog = (student) => {
  qrDialog.value = true;
  studentData.value = student;
  // $q.dialog({
  //   component: QrCode,
  //   componentProps: {
  //     studentData: student,
  //   },
  // });
};

const remove = (id) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to remove student?",
    cancel: true,
  }).onOk(() => studentStore.deleteStudent(id));
};

const handlerDialogStudent = (student) => {
  if (student.id) {
    $q.dialog({
      component: AddEditStudent,
      componentProps: {
        studentData: student,
      },
    });
  } else {
    $q.dialog({
      component: AddEditStudent,
    });
  }
};

// Student Table
const studentCols = [
  {
    name: "name",
    required: true,
    align: "left",
    label: "Name",
    field: (row) => `${row.lname}, ${row.fname} ' '${row.mname[0]}.`,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    align: "left",
    label: "Vaccine",
    field: (row) => row.vaccine,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    align: "left",
    label: "First Dose",
    field: (row) => row.firstDose.date,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    align: "left",
    label: "Second Dose",
    field: (row) => row.secondDose.date,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    align: "center",
    label: "Actions",
    name: "actions",
  },
];

const students = computed(() => studentStore.students);
onBeforeMount(() => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
  studentStore.getStudents();
});
</script>
