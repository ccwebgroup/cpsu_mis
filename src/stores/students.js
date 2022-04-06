import { defineStore } from "pinia";
import { Notify } from "quasar";

import { db, firestore } from "src/boot/firebase";

export const useStudentStore = defineStore("students", {
  state: () => ({
    students: [],
  }),
  actions: {
    async deleteStudent(id) {
      const studentRef = firestore.doc(db, "students", id);
      await firestore.deleteDoc(studentRef);
      this.students = this.students.filter((item) => item.id !== id);
      Notify.create({
        createdAt: firestore.serverTimestamp(),
        type: "dark",
        message: "Student removed!",
        icon: "delete",
      });
    },

    async updateStudent(payload) {
      const studentRef = firestore.doc(db, "students", payload.id);
      await firestore.updateDoc(studentRef, payload);
      Notify.create({
        createdAt: firestore.serverTimestamp(),
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
      const studentRef = firestore.collection(db, "students");
      const studentSnap = await firestore.getDocs(studentRef);
      studentSnap.forEach((doc) => {
        let studentData = doc.data();
        this.students.push({ ...studentData, id: doc.id });
      });
    },

    async addStudent(payload) {
      const studentRef = firestore.collection(db, "students");
      const docSnap = await firestore.addDoc(studentRef, payload);
      Notify.create({
        createdAt: firestore.serverTimestamp(),
        type: "positive",
        message: "Student succesfuly added",
        icon: "thumb_up",
      });
      payload.id = docSnap.id;
      this.students.unshift(payload);
    },
  },
});
