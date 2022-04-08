import { defineStore } from "pinia";
import { Notify } from "quasar";

import { db, firestore } from "src/boot/firebase";

export const useStudentStore = defineStore("students", {
  state: () => ({}),
  actions: {},
});
