import { defineStore } from "pinia";

import { auth, fireauth } from "src/boot/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: {},
  }),
  actions: {
    handleAuthState() {
      fireauth.onAuthStateChanged(auth, async (user) => {
        if (user) {
          const idTokenResult = await auth.currentUser.getIdTokenResult();
          if (idTokenResult.claims.admin) user.admin = true;
          this.authUser = user;
        } else {
          this.authUser = {};
        }
      });
    },
  },
});
