import { defineStore } from "pinia";
import { db, fs } from "boot/firebase";
import { Loading, Notify } from "quasar";

export const workloadStore = defineStore("workloads", {
  state: () => ({
    workloads: [],
  }),

  actions: {
    async addWorkload(data) {
      Loading.show();

      delete data.id;
      const workloadRef = fs.collection(db, "workloads");
      const doc = await fs.addDoc(workloadRef, {
        ...data,
        createdAt: fs.serverTimestamp(),
      });
      this.workloads.unshift({ ...data, id: doc.id, createdAt: new Date() });

      Loading.hide();

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Workload added successfully!",
        position: "bottom-right",
      });
      return true;
    },

    async updateWorkload(data) {
      Loading.show();

      delete data.id;
      const workloadRef = fs.doc(db, "workloads", data.id);
      const doc = await fs.updateDoc(workloadRef, {
        ...data,
        updatedAt: fs.serverTimestamp(),
      });

      const i = this.workloads.findIndex((item) => item.id == doc.id);

      this.workloads[i] = { ...data, id: doc.id, updatedAt: new Date() };

      Loading.hide();

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Workload added successfully!",
        position: "bottom-right",
      });
      return true;
    },

    async deleteWorkload(id) {
      Loading.show();

      const workloadRef = fs.doc(db, "workloads", id);
      const doc = await fs.deleteDoc(workloadRef);

      const i = this.workloads.findIndex((item) => item.id == id);
      this.workloads.splice(i, 1);

      Loading.hide();

      Notify.create({
        type: "positive",
        icon: "thumb_up",
        message: "Workload added successfully!",
        position: "bottom-right",
      });
      return true;
    },

    async getAllWorkloads() {
      Loading.show();

      const workloadRef = fs.collection(db, "workloads");
      const q = fs.query(workloadRef);
      const docs = fs.getDocs(q);
      docs.forEach((doc) => {
        const data = { ...doc.data(), id: doc.id };
        data.createdAt = data.createdAt.toDate();
        data.updatedAt = data.createdAt.toDate();

        const i = this.workloads.findIndex((item) => item.id == doc.id);
        if (i == -1) this.workloads.push(data);
      });
    },
  },
});
