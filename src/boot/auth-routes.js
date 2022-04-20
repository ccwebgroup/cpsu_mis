import { boot } from "quasar/wrappers";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "src/stores/auth";

export default boot(async ({ router, store }) => {
  const auth = getAuth();

  await new Promise((resolve) => {
    const stopObserver = onAuthStateChanged(auth, (firebaseUser) => {
      resolve(firebaseUser);
      stopObserver();
    });
  });

  router.beforeEach((to, from) => {
    const authStore = useAuthStore(store);
    console.log(authStore.authUser);

    if (to.meta.requiresAuth && !auth.currentUser) {
      return {
        path: "/auth/login",
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      };
    }

    if (to.meta.requireAdmin && store.state.value.authUser.admin) {
      return {
        path: "/notfound",
      };
    }

    if (auth.currentUser && to.path === "/login") {
      return { path: from.path };
    }
  });
});
