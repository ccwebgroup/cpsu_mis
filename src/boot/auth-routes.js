import { boot } from "quasar/wrappers";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default boot(async ({ router }) => {
  const auth = getAuth();
  let claims;

  await new Promise((resolve) => {
    const stopObserver = onAuthStateChanged(getAuth(), (firebaseUser) => {
      resolve(firebaseUser);
      stopObserver();
    });
  });
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdTokenResult();
    if (token.claims.admin) claims = "admin";
  } else {
    claims = null;
  }

  router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !auth.currentUser) {
      return {
        path: "/auth/login",
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      };
    }

    if (to.meta.requireAdmin && claims !== "admin") {
      return {
        path: "/notfound",
      };
    }

    if (auth.currentUser && to.path === "/login") {
      return { path: from.path };
    }
  });
});
