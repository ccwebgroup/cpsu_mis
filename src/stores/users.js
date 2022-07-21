import { defineStore } from "pinia";
import { Notify, Dialog, Loading } from "quasar";

import { db, auth, fa, fs } from "src/boot/firebase";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
  }),
  actions: {
    async setUserRole(uid, role) {
      Loading.show();
      const token = await auth.currentUser.getIdToken();
      let roleData = {};
      switch (role) {
        case "Admin":
          roleData = { admin: true };
          break;
        case "Faculty":
          roleData = { faculty: true };
          break;
        case "Staff":
          roleData = { staff: true };
          break;
        case "Student":
          roleData = { student: true };
          break;
        case "Technical":
          roleData = { technical: true };
          break;
        case "Not Set":
          role = "";
          roleData = null;
          break;
      }
      try {
        await this.api.put("addRole/" + uid, roleData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await fs.updateDoc(fs.doc(db, "users", uid), {
          role: role,
        });
        const index = this.users.findIndex((item) => item.uid == uid);
        if (index > -1) {
          this.users[index].role = role;
        }

        Notify.create({
          type: "positive",
          message: `Added ${Object.keys(role)[0]} role to the user.`,
          icon: "manage_accounts",
        });
      } catch (err) {
        console.log(err);
      } finally {
        Loading.hide();
      }
    },

    async updateUser(payload) {
      Loading.show();
      const token = await auth.currentUser.getIdToken();
      try {
        const result = await this.api.put(
          "updateUser/" + payload.uid,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (result) {
          const user = result.data;
          const userRef = fs.doc(db, "users", user.uid);
          await fs.updateDoc(userRef, user);

          const index = this.users.findIndex((item) => item.uid == user.uid);
          if (index > -1) {
            Object.assign(this.users[index], user);
          }

          Notify.create({
            type: "positive",
            message: "User succesfuly updated.",
            icon: "edit_note",
          });
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        Loading.hide();
      }
    },

    async deleteUser(uid) {
      const token = await auth.currentUser.getIdToken();
      Dialog.create({
        title: "Confirm",
        message: "Are you sure you want to delete the user?",
        cancel: true,
      }).onOk(async () => {
        Loading.show();
        try {
          const result = await this.api.delete("deleteUser/" + uid, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (result.status == 200) {
            await fs.deleteDoc(fs.doc(db, "users", uid));
            this.users = this.users.filter((item) => item.uid !== uid);
          }

          Notify.create({
            type: "negative",
            message: "User permanently deleted.",
            icon: "delete_forever",
          });
        } catch (err) {
        } finally {
          Loading.hide();
        }
      });
    },

    async getUsers() {
      Loading.show();
      const token = await auth.currentUser.getIdToken();
      try {
        const result = await this.api.get("getUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        result.data.forEach(async (user) => {
          const userSnap = await fs.getDoc(fs.doc(db, "users", user.uid));
          if (userSnap.exists()) {
            Object.assign(user, userSnap.data());
            const index = this.users.findIndex((item) => item.uid == user.uid);
            if (index == -1) {
              this.users.push(user);
            }
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        Loading.hide();
      }
    },

    async addUser(payload) {
      Loading.show();
      const token = await auth.currentUser.getIdToken();
      try {
        const result = await this.api.post("addUser", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (result) {
          const userData = result.data;
          const { password, uid, ...user } = payload;
          const userRef = fs.doc(db, "users", userData.uid);
          await fs.setDoc(userRef, user);
          this.users.unshift(result.data);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        Loading.hide();
      }
    },

    async logoutUser() {
      Loading.show();
      await auth.signOut();
      Loading.hide();
      this.router.replace("/auth/login");
    },

    async loginUser(payload) {
      Loading.show();
      try {
        const userCredential = await fa.signInWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        if (this.$route.query.redirect) {
          this.router.push(this.$route.query.redirect);
        } else {
          this.router.replace("/home");
        }
      } catch (err) {
        const errorCode = err.code;
        const errorMessage = err.message;
        Dialog.create({
          title: "Sign in Error",
          message: errorMessage,
        });
      } finally {
        Loading.hide();
      }
    },

    async reauthUser(payload) {
      Loading.show();
      const credential = fa.EmailAuthProvider.credential(
        payload.email,
        payload.password
      );

      await fa.reauthenticateWithCredential(auth.currentUser, credential);

      Loading.hide();
      return credential;
    },
  },
});
