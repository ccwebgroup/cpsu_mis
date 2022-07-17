import { defineStore } from "pinia";
import { Dialog } from "quasar";

import { db, fs } from "src/boot/firebase";

// Other Stores
import { useStudentStore } from "./students";

export const useVaxLogStore = defineStore("vaxLogs", {
  state: () => ({
    allVaxlogs: [],
  }),

  getters: {
    formattedLogs: (state) => {
      return state.allVaxlogs.sort((a, b) => b.timeIn - a.timeIn);
    },
  },

  actions: {
    async getAllVaxlogs() {
      this.allVaxlogs = [];
      const logRef = fs.collection(db, "studentLogs");
      const snapshots = await fs.getDocs(logRef);
      snapshots.forEach((logDoc) => {
        const logData = { ...logDoc.data(), id: logDoc.id };
        this.allVaxlogs.push(logData);
      });
    },

    async addVaxLog(payload) {
      const studentRef = fs.doc(db, "students", payload.id);
      const docSnap = await fs.getDoc(studentRef);
      if (docSnap.exists()) {
        const logRef = collection(db, "studentLogs");
        const log = await addDoc(logRef, {
          recordId: payload.id,
          studentInfo: docSnap.data(),
          timeIn: fs.serverTimestamp(),
        });

        Dialog.create({
          title: "Verified!",
          message: `You are vaccinated.`,
          type: "positive",
        });
      } else {
        // doc.data() will be undefined in this case
        Dialog.create({
          title: "Status",
          message: `The id: ${payload.id} is not recorded as a vaccinated student. Please refer to the authority.`,
          type: "negative",
        });
      }
    },
  },
});
