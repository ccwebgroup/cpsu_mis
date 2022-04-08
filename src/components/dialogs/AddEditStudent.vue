<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-pa-sm" style="max-width: 900px">
      <q-card-section>
        <div class="text-h6 q-mx-md text-center">
          {{ studentData ? "EDIT" : "ADD" }} RECORDS
        </div>
        <div class="text-subtitle2 q-mb-md">Basic Info</div>
        <div class="row q-gutter-sm">
          <div class="col-12 col-md-3">
            <q-input
              v-model="student.fname"
              dense
              outlined
              placeholder="Fist Name"
              rounded
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="student.lname"
              dense
              outlined
              placeholder="Last Name"
              rounded
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="student.mname"
              dense
              outlined
              placeholder="Middle Name"
              rounded
            />
          </div>
        </div>
        <div class="flex items-center q-gutter-x-sm q-mt-md">
          <div class="text-body2">Birth Date</div>
          <q-input v-model="student.birthDate" outlined type="date" dense />
        </div>
        <div class="q-mt-sm row justify-around q-gutter-sm">
          <div class="col-12 col-md-3">
            <q-input v-model="student.course" dense label="Course" />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="student.year" dense label="Year" />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="student.section" dense label="Section" />
          </div>
        </div>
      </q-card-section>

      <q-separator />
      <!-- Vaccine Details -->
      <q-card-section class="bg-blue-1">
        <div class="text-subtitle2">Vaccination Details</div>
        <div class="q-pa-md" style="width: 300px">
          <q-select
            class="inset"
            filled
            v-model="student.vaccine"
            :options="vaccineOpt"
            label="Vaccine"
          />
        </div>

        <div class="q-mb-md">
          <div class="text-subtitle2 q-mb-md">First Dose</div>
          <div class="row justify-around items-center q-gutter-sm">
            <div class="col-12 col-md-3">
              <q-select
                dense
                outlined
                v-model="student.firstDose.city"
                label="City or Municipality"
                use-input
                input-debounce="0"
                :options="filterOptions"
                option-value="city"
                option-label="city"
                emit-value
                @filter="filterFn"
                style="width: 250px"
              />
            </div>
            <div class="col-12 col-md-3">
              <div class="text-subtitle2">Date</div>
              <q-input v-model="student.firstDose.date" type="date" dense />
            </div>
          </div>
        </div>

        <div v-show="student.vaccine !== 'Johnson & Johnson\'s Janssen'">
          <div class="text-subtitle2 q-mb-md">Second Dose</div>
          <div class="row justify-around items-center q-gutter-sm">
            <div class="col-12 col-md-3">
              <q-select
                dense
                outlined
                v-model="student.secondDose.city"
                label="City or Municipality"
                use-input
                input-debounce="0"
                :options="filterOptions"
                option-value="city"
                option-label="city"
                emit-value
                @filter="filterFn"
                style="width: 250px"
              />
            </div>
            <div class="col-12 col-md-3">
              <div class="text-subtitle2">Date</div>
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

          <div class="row justify-around items-center q-gutter-sm">
            <div class="col-12 col-md-3">
              <q-select
                dense
                outlined
                v-model="student.booster.city"
                label="City or Municipality"
                use-input
                input-debounce="0"
                :options="filterOptions"
                option-value="city"
                option-label="city"
                emit-value
                @filter="filterFn"
                style="width: 250px"
              />
            </div>
            <div class="col-12 col-md-3">
              <div class="text-subtitle2">Date</div>
              <q-input v-model="student.booster.date" type="date" dense />
            </div>
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
import phjson from "src/json/ph.json";
// Import Stores
import { useStudentStore } from "src/stores/students";

// Define Stores
const studentStore = useStudentStore();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const props = defineProps(["studentData"]);

const filterOptions = ref(phjson);
const filterFn = (val, update) => {
  update(() => {
    if (val === "") {
      filterOptions.value = phjson;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = phjson.filter(
        (v) => v.city.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const vaccineOpt = [
  "Johnson & Johnson's Janssen",
  "Pfizer",
  "CoronaVac (Sinovac)",
  "Moderna",
  "Covaxin",
];
const student = reactive({
  fname: "",
  lname: "",
  mname: "",
  birthDate: "",
  course: "",
  year: "",
  section: "",
  vaccine: "",
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
