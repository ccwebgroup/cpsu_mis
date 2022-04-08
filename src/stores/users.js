import { defineStore } from "pinia";
import { Notify, Dialog } from "quasar";

import { db, auth, fireauth, firestore } from "src/boot/firebase";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
  }),
  actions: {
    async deleteUser(payload) {
      Dialog.create({
        title: "Confirm",
        message: "Are you sure you want to delete the user?",
        cancel: true,
      }).onOk(async () => {
        await firestore.deleteDoc(firestore.doc(db, "users", payload.id));
        this.users = this.users.filter((item) => item.id !== payload.id);

        Dialog.create({
          title: "Process successful!",
          message:
            "User was deleted from the database. Please remove user in the authentication service of firebase.",
        });
      });
    },

    async getUsers() {
      this.users = [];
      const snapshots = await firestore.getDocs(
        firestore.collection(db, "users")
      );
      snapshots.forEach((userDoc) => {
        const userData = userDoc.data();
        userData.createdAt = userData.createdAt.toDate();
        this.users.push(userData);
      });
    },

    async addUser(payload) {
      try {
        const userCredential = await fireauth.createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        const user = userCredential.user;

        if (user) {
          const userSnap = await firestore.setDoc(
            firestore.doc(db, "users", user.uid),
            {
              email: payload.email,
              id: user.uid,
              role: payload.role,
              createdAt: firestore.serverTimestamp(),
            }
          );

          this.users.push({
            createdAt: new Date(),
            email: payload.email,
            username: payload.username,
            id: user.uid,
            role: payload.role,
          });

          Notify.create({
            type: "positive",
            icon: "person_add",
            message: "User succesfully registered.",
          });
        }
      } catch (err) {
        const errorCode = err.code;
        const errorMessage = err.message;
        Dialog.create({
          title: "Registration Error",
          message: errorMessage,
        });
      }
    },

    async logoutUser() {
      await auth.signOut();
      this.router.replace("/auth/login");
    },

    async loginUser(payload) {
      try {
        const userCredential = await fireauth.signInWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        if (this.$route.query.redirect) {
          this.router.push(this.$route.query.redirect);
        } else {
          this.router.replace("/dashboard");
        }
      } catch (err) {
        const errorCode = err.code;
        const errorMessage = err.message;
        Dialog.create({
          title: "Sign in Error",
          message: errorMessage,
        });
      }
    },

    async reauthUser(payload) {
      const credential = fireauth.EmailAuthProvider.credential(
        payload.email,
        payload.password
      );

      await fireauth.reauthenticateWithCredential(auth.currentUser, credential);
      return credential;
    },
  },
});
