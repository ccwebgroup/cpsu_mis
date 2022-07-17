import { defineStore } from "pinia";
import { Notify } from "quasar";

import { db, fs } from "src/boot/firebase";

export const useStudentStore = defineStore("students", {
  state: () => ({
    students: [],
  }),
  actions: {
    async deleteStudent(id) {
      const studentRef = fs.doc(db, "students", id);
      await fs.deleteDoc(studentRef);
      this.students = this.students.filter((item) => item.id !== id);
      Notify.create({
        createdAt: fs.serverTimestamp(),
        type: "dark",
        message: "Student removed!",
        icon: "delete",
      });
    },

    async updateStudent(payload) {
      const studentRef = fs.doc(db, "students", payload.id);
      await fs.updateDoc(studentRef, payload);
      Notify.create({
        createdAt: fs.serverTimestamp(),
        type: "positive",
        message: "Student details updated",
        icon: "edit",
      });
      let index = this.students.findIndex((item) => item.id == payload.id);
      if (index > -1) {
        this.students[index] = payload;
      }
    },

    async getStudents() {
      this.students = [];
      const studentRef = fs.collection(db, "students");
      const studentSnap = await fs.getDocs(studentRef);
      studentSnap.forEach((doc) => {
        let studentData = doc.data();
        this.students.push({ ...studentData, id: doc.id });
      });
    },

    async addStudent(payload) {
      const studentRef = fs.collection(db, "students");
      const docSnap = await fs.addDoc(studentRef, payload);
      Notify.create({
        createdAt: fs.serverTimestamp(),
        type: "positive",
        message: "Student succesfuly added",
        icon: "thumb_up",
      });
      payload.id = docSnap.id;
      this.students.unshift(payload);
    },
  },
});
