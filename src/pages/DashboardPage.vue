<template>
  <q-page padding>
    <q-card flat>
      <q-card-actions align="right">
        <q-btn
          no-caps
          @click="handlerDialogStudent"
          padding="xs xl"
          dense
          unelevated
          icon="add_circle"
          label="Add Student"
        />
      </q-card-actions>

      <q-card-section>
        <q-table
          title="Students Vaccination Records"
          :rows="students"
          row-key="id"
          :filter="filter"
          :columns="studentCols"
          :loading="loading"
        >
          <template v-slot:top-right>
            <q-input dense debounce="500" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td>
                {{
                  `${props.row.lname}, ${props.row.fname} ${props.row.lname[0]}.`
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
                  @click="handleQrDialog(props.row.id)"
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
      <q-card>
        <q-card-section>
          <!-- <qr-code
            :value="qrCodeStringValue"
            :dotsOptions="dotsOptions"
            :qrOptions="qrOptions"
            :cornersSquareOptions="cornersSquareOptions"
            :cornersDotOptionsHelper="cornersDotOptionsHelper"
            image="logo/cpsu-logo.jpg"
            :downloadOptions="{ name: 'vqr', extension: 'png' }"
            :download="true"
            downloadButton="downloadButton"
          /> -->
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            @click="downloadQrCode"
            padding="xs xl"
            rounded
            color="primary"
            label="Download"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onBeforeMount, computed, reactive, ref } from "vue";
// Import Other Components
import AddEditStudent from "src/components/dialogs/AddEditStudent.vue";
import { useQuasar } from "quasar";
// Import Stores
import { useStudentStore } from "src/stores/students";
// Define Stores
const studentStore = useStudentStore();

const $q = useQuasar();

const filter = ref("");
const loading = ref(false);

const qrCodeStringValue = ref("");
const qrDialog = ref(false);
const dotsOptions = {
  type: "rounded",
  gradient: {
    type: "linear",
    rotation: 0.08726646259971647,
    colorStops: [
      { offset: 0, color: "#420085" },
      { offset: 1, color: "#310038" },
    ],
  },
};
const qrOptions = {
  typeNumber: "0",
  mode: "Byte",
  errorCorrectionLevel: "L",
};
const cornersSquareOptions = { type: "extra-rounded", color: "#000000" };
const cornersSquareOptionsHelper = {
  colorType: { single: true, gradient: false },
  gradient: {
    linear: true,
    radial: false,
    color1: "#000000",
    color2: "#000000",
    rotation: "0",
  },
};

const cornersDotOptions = { type: "", color: "#000000" };
const cornersDotOptionsHelper = {
  colorType: { single: true, gradient: false },
  gradient: {
    linear: true,
    radial: false,
    color1: "#000000",
    color2: "#000000",
    rotation: "0",
  },
};

// Methods Sections
const downloadQrCode = () => {
  const el = document.querySelector(".downloadButton");
  console.log(el);
};

const handleQrDialog = (id) => {
  qrCodeStringValue.value = id;
  qrDialog.value = true;
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
