<template>
  <q-page padding>
    <q-card class="q-mx-auto" style="max-width: 600px">
      <q-card-section>
        <q-btn flat round to="/" icon="arrow_back" />
        <div class="text-h6 q-mx-md text-center">ADD STUDENT</div>
        <div class="text-subtitle2 q-mb-md">Basic Info</div>
        <div class="flex q-gutter-x-sm">
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
      <q-card-section class="bg-grey-1">
        <div class="text-subtitle2">VACCINE DETAILS</div>
        <div class="flex flex-center justify-between">
          <q-checkbox v-model="student.johnsonVaccine" />
          <div class="text-caption">
            Please check the box if Johnson & Johnson
          </div>
          <div class="text-body2">Date:</div>
          <q-input v-model="student.johnsonVaccineDate" type="date" dense />
        </div>
        <div v-show="!student.johnsonVaccine" class="q-mt-sm">
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

      <q-card-section class="bg-grey-3">
        <div>
          <div class="text-subtitle2 q-mb-md">
            Booster <span class="text-negative">(not required)</span>
          </div>
          <div class="row justify-around items-center q-gutter-x-sm">
            <!-- <vue-google-autocomplete
              id="map"
              classname="form-control"
              placeholder="Start typing"
              v-on:placechanged="getAddressData"
            >
            </vue-google-autocomplete> -->
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

      <q-card-actions align="right" class="q-mt-md">
        <q-btn
          class="q-mb-md"
          @click="save"
          color="primary"
          rounded
          padding="xs xl"
          label="Save"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive } from "vue";
// import VueGoogleAutocomplete from "vue-google-autocomplete";

// Import Stores
import { useStudentStore } from "src/stores/students";

// Define Stores
const studentStore = useStudentStore();

const student = reactive({
  fname: "",
  lname: "",
  mname: "",
  birthDate: "",
  course: "",
  year: "",
  section: "",
  johnsonVaccine: false,
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

const save = () => {
  studentStore.addStudent(student);
};
</script>
