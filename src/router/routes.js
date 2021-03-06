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
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("src/pages/HomePage.vue"),
      },
      /*  {
        path: "/lobby",
        component: () => import("src/pages/LobbyPage.vue"),
      }, */

      // Scheduler Routes
      {
        path: "/scheduler/manage-data",
        component: () => import("src/pages/scheduler/ManageData.vue"),
      },
      {
        path: "/scheduler/manage-workload",
        component: () => import("src/pages/scheduler/WorkLoad.vue"),
      },
      {
        path: "/scheduler/plot-schedule",
        component: () => import("src/pages/scheduler/PlotSchedule.vue"),
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
