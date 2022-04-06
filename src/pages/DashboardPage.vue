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
          title="Students Vaccine Records"
          :rows="students"
          row-key="id"
          :columns="studentCols"
        >
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
  </q-page>
</template>

<script setup>
import { onBeforeMount, computed, reactive } from "vue";
// Import Other Components
import AddEditStudent from "src/components/dialogs/AddEditStudent.vue";
import { useQuasar } from "quasar";
// Import Stores
import { useStudentStore } from "src/stores/students";
// Define Stores
const studentStore = useStudentStore();

const $q = useQuasar();

// Mthods Sections
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
onBeforeMount(() => studentStore.getStudents());
</script>
