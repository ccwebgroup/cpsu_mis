const routes = [
  /* Auth Routes */
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "/auth/login",
        component: () => import("src/pages/auth/LoginPage.vue"),
      },
    ],
  },

  /* Main Routes */
  {
    path: "/",
    meta: {
      requiresAuth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        component: () => import("src/pages/DashboardPage.vue"),
      },
    ],
  },

  // Administrative routes
  {
    path: "/management",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      requireAdmin: true,
      requiresAuth: true,
    },
    children: [
      {
        path: "/management/users",
        component: () => import("src/pages/management/UsersPage.vue"),
      },
    ],
  },

  // Vaccination Tracker
  {
    path: "/vaccination-tracker",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/vaccination-tracker/student-records",
        component: () => import("src/pages/vaccine-tracker/StudentRecords.vue"),
      },
      {
        path: "/vaccination-tracker/log-records",
        component: () => import("src/pages/vaccine-tracker/LogRecords.vue"),
      },
      {
        path: "/vaccination-tracker/qr-scanner",
        component: () => import("src/pages/vaccine-tracker/QrScannerPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
