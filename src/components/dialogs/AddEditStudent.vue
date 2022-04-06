<template>
  <q-dialog ref="dialogRef">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6 q-mx-md text-center">
          {{ studentData ? "EDIT" : "ADD" }} RECORDS
        </div>
        <div class="text-subtitle2 q-mb-md">Basic Info</div>
        <div class="row q-gutter-x-sm">
          <q-input
            v-model="student.fname"
            dense
            outlined
            label="Fist Name"
            rounded
          />
          <q-input
            v-model="student.lname"
            dense
            outlined
            label="Last Name"
            rounded
          />
          <q-input
            v-model="student.mname"
            dense
            outlined
            label="Middle Name"
            rounded
          />
        </div>
        <div class="flex items-center q-gutter-x-sm q-mt-md">
          <div class="text-body2">Birth Date:</div>
          <q-input v-model="student.birthDate" outlined type="date" dense />
        </div>
        <div class="q-mt-sm row justify-around">
          <q-input v-model="student.course" dense label="Course" />
          <q-input v-model="student.year" dense label="Year" />
          <q-input v-model="student.section" dense label="Section" />
        </div>
      </q-card-section>

      <q-separator />
      <!-- Vaccine Details -->
      <q-card-section class="bg-grey-1">
        <div class="text-subtitle2">VACCINE DETAILS</div>
        <div class="flex flex-center justify-between">
          <q-checkbox
            v-model="student.vaccine"
            true-value="johnson & johnson"
          />
          <div class="text-caption">
            Please check the box if Johnson & Johnson
          </div>
          <div class="text-body2">Date:</div>
          <q-input v-model="student.johnsonVaccineDate" type="date" dense />
        </div>
        <div v-show="student.vaccine !== 'johnson & johnson'" class="q-mt-sm">
          <div class="q-mb-md">
            <div class="text-subtitle2 q-mb-md">First Dose</div>
            <div class="row justify-around items-center q-gutter-x-sm">
              <q-input
                v-model="student.firstDose.city"
                dense
                outlined
                label="City/Municipality"
              />
              <div class="text-body2">Date:</div>
              <q-input v-model="student.firstDose.date" type="date" dense />
            </div>
          </div>

          <div>
            <div class="text-subtitle2 q-mb-md">Second Dose</div>
            <div class="row justify-around items-center q-gutter-x-sm">
              <q-input
                v-model="student.secondDose.city"
                dense
                outlined
                label="City/Municipality"
              />
              <div class="text-body2">Date:</div>
              <q-input v-model="student.secondDose.date" type="date" dense />
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Booster Section -->
      <q-card-section class="bg-grey-3">
        <div>
          <div class="text-subtitle2 q-mb-md">
            Booster <span class="text-negative">(not required)</span>
          </div>
          <div class="row justify-around items-center q-gutter-x-sm">
            <q-input
              v-model="student.booster.city"
              dense
              outlined
              label="City/Municipality"
            />
            <div class="text-body2">Date:</div>
            <q-input v-model="student.booster.date" type="date" dense />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-mt-md q-pb-md">
        <q-btn
          no-caps
          color="dark"
          rounded
          padding="xs xl"
          label="Cancel"
          v-close-popup
        />
        <q-btn
          :disable="disableButton"
          @click="save"
          no-caps
          color="primary"
          rounded
          padding="xs xl"
          :label="studentData ? 'Update' : 'Save'"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useDialogPluginComponent } from "quasar";
// Import Stores
import { useStudentStore } from "src/stores/students";

// Define Stores
const studentStore = useStudentStore();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const props = defineProps(["studentData"]);

const student = reactive({
  fname: "",
  lname: "",
  mname: "",
  birthDate: "",
  course: "",
  year: "",
  section: "",
  vaccine: false,
  johnsonVaccineDate: "",
  firstDose: {
    city: "",
    date: "",
  },
  secondDose: {
    city: "",
    date: "",
  },
  booster: {
    city: "",
    date: "",
  },
});

onMounted(() => {
  if (props.studentData) {
    Object.assign(student, props.studentData);
  }
});

const disableButton = ref(true);
watch(student, () => {
  disableButton.value = false;
});
const save = () => {
  if (props.studentData) {
    studentStore.updateStudent(student);
  } else {
    studentStore.addStudent(student);
  }
};
</script>
