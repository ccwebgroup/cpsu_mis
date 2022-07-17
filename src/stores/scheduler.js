import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import { db, fs } from "src/boot/firebase";

export const schedStore = defineStore("sched", {
  state: () => ({
    subjects: [],
    courses: [],
    instructors: [],
    rooms: [],
    schedules: [],
  }),

  actions: {
    async updateSchedule(sched) {
      Loading.show();
      const docRef = fs.doc(db, "schedules", sched.id);
      await fs.updateDoc(docRef, {
        ...sched,
        updatedAt: fs.serverTimestamp(),
      });

      Loading.hide();

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Schedule updated successfully!",
        position: "bottom-right",
      });
      return true;
    },

    async deleteSchedule(id) {
      Loading.show();
      const docRef = fs.doc(db, "schedules", id);
      await fs.deleteDoc(docRef);

      const i = this.schedules.findIndex((item) => item.id == id);
      if (i > -1) this.schedules.splice(i, 1);
      Loading.hide();

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Schedule deleted successfully!",
        position: "bottom-right",
      });
      return true;
    },

    async getSchedules(field, fieldId) {
      Loading.show();
      this.schedules = [];
      const schedRef = fs.collection(db, "schedules");
      const q = fs.query(schedRef, fs.where(`${field}`, "==", fieldId));
      const docs = await fs.getDocs(q);
      docs.forEach(async (doc) => {
        const schedData = { ...doc.data(), id: doc.id };
        schedData.createdAt = schedData.createdAt.toDate();
        schedData.duration *= 60;
        // Get Subject
        schedData.subject = await this.getData(schedData.subjectId, "subjects");
        schedData.course = await this.getData(schedData.courseId, "courses");
        schedData.instructor = await this.getData(
          schedData.instructorId,
          "instructors"
        );
        schedData.room = await this.getData(schedData.roomId, "rooms");

        const i = this.schedules.findIndex((item) => item.id == doc.id);
        if (i == -1) {
          this.schedules.push(schedData);
        }
      });
      Loading.hide();
    },

    async getData(id, collection) {
      const docRef = fs.doc(db, collection, id);
      const doc = await fs.getDoc(docRef);

      return { ...doc.data(), id: doc.id };
    },

    async addSchedule(schedData) {
      Loading.show();
      const schedRef = fs.collection(db, "schedules");
      await fs.addDoc(schedRef, {
        ...schedData,
        createdAt: fs.serverTimestamp(),
      });

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Schedule added successfully!",
        position: "bottom-right",
      });
      Loading.hide();
      return true;
    },

    async addSubject(subject) {
      delete subject.id;
      const subRef = fs.collection(db, "subjects");
      const doc = await fs.addDoc(subRef, {
        ...subject,
        createdAt: fs.serverTimestamp(),
      });
      this.subjects.unshift({ ...subject, id: doc.id, createdAt: new Date() });

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Subject added successfully!",
        position: "bottom-right",
      });

      return true;
    },

    async addCourse(courseData) {
      delete courseData.id;
      const classRef = fs.collection(db, "courses");
      const doc = await fs.addDoc(classRef, {
        ...courseData,
        name: `${courseData.course} - ${courseData.year}${courseData.section}`,
        createdAt: fs.serverTimestamp(),
      });
      this.courses.unshift({
        ...courseData,
        id: doc.id,
        createdAt: new Date(),
      });

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Class group added successfully!",
        position: "bottom-right",
      });

      return true;
    },

    async addInstructor(inst) {
      delete inst.id;
      const instRef = fs.collection(db, "instructors");
      const doc = await fs.addDoc(instRef, {
        ...inst,
        createdAt: fs.serverTimestamp(),
      });
      this.instructors.unshift({ ...inst, id: doc.id, createdAt: new Date() });

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Instructor added successfully!",
        position: "bottom-right",
      });

      return true;
    },

    async addRoom(room) {
      const roomRef = fs.collection(db, "rooms");
      const doc = await fs.addDoc(roomRef, {
        room: room,
        createdAt: fs.serverTimestamp(),
      });
      this.rooms.unshift({ room: room, id: doc.id, createdAt: new Date() });

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Room added successfully!",
        position: "bottom-right",
      });

      return true;
    },

    async updateData(id, collection, changes) {
      delete changes.id;
      delete changes.createdAt;

      const docRef = fs.doc(db, collection, id);
      await fs.updateDoc(docRef, {
        ...changes,
        updatedAt: fs.serverTimestamp(),
      });

      const i = this[collection].findIndex((item) => item.id == id);
      this[collection][i] = { ...changes, id: id };

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Data has been updated successfully!",
        position: "bottom-right",
      });

      return true;
    },

    async deleteData(id, collection) {
      const docRef = fs.doc(db, collection, id);
      await fs.deleteDoc(docRef);

      const i = this[collection].findIndex((item) => item.id == id);
      this[collection].splice(i, 1);

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Data has been deleted successfully!",
        position: "bottom-right",
      });

      return true;
    },

    async getAllData() {
      Loading.show();
      this.subjects = [];
      this.courses = [];
      this.instructors = [];
      this.rooms = [];

      const subRef = fs.collection(db, "subjects");
      const classRef = fs.collection(db, "courses");
      const instRef = fs.collection(db, "instructors");
      const roomRef = fs.collection(db, "rooms");

      const subDocs = await fs.getDocs(subRef);
      subDocs.forEach((doc) => {
        const item = { ...doc.data(), id: doc.id };
        item.createdAt = item.createdAt.toDate();

        this.subjects.push(item);
      });

      const classDocs = await fs.getDocs(classRef);
      classDocs.forEach((doc) => {
        const item = { ...doc.data(), id: doc.id };
        item.createdAt = item.createdAt.toDate();

        this.courses.push(item);
      });

      const insDocs = await fs.getDocs(instRef);
      insDocs.forEach((doc) => {
        const item = { ...doc.data(), id: doc.id };
        item.createdAt = item.createdAt.toDate();

        this.instructors.push(item);
      });

      const roomDocs = await fs.getDocs(roomRef);
      roomDocs.forEach((doc) => {
        const item = { ...doc.data(), id: doc.id };
        item.createdAt = item.createdAt.toDate();

        this.rooms.push(item);
      });

      Loading.hide();
    },
  },
});
