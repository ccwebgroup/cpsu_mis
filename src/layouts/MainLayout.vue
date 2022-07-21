<template>
  <q-layout view="hHh LpR lFr" con>
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="logo/ccs-logo.jpg" />
          </q-avatar>
          MIS-Sys
        </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          :icon="rightDrawerOpen ? 'menu_open' : 'double_arrow'"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <q-list padding dense>
        <!-- User Details -->
        <q-item class="q-mb-md">
          <q-item-section avatar>
            <q-avatar color="primary" size="56px" class="q-mb-sm">
              <q-icon color="white" name="fas fa-user-tie" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1 text-bold">
              {{ authUser.displayName }}
            </q-item-label>
            <q-item-label caption>{{
              authUser.admin ? "Admin" : authUser.email
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
        <q-separator spaced />
        <q-expansion-item
          class="text-subtitle1"
          expand-separator
          icon="today"
          label="Scheduler"
          caption="System for scheduling"
        >
          <q-list>
            <q-item clickable to="/scheduler/manage-data" :inset-level="1">
              <q-item-section avatar>
                <q-icon name="edit_calendar" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subititle">Manage Data</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/scheduler/manage-workload" :inset-level="1">
              <q-item-section avatar>
                <q-icon name="pending_actions" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subititle">Workload</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable to="/scheduler/plot-schedule" :inset-level="1">
              <q-item-section avatar>
                <q-icon name="date_range" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subititle"
                  >Plot Schedule</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item
          class="text-subtitle1"
          expand-separator
          icon="vaccines"
          label="Vaccination Tracker"
          caption="System for students."
        >
          <q-list>
            <!-- <q-item
              clickable
              to="/vaccination-tracker/qr-scanner"
              :inset-level="1"
            >
              <q-item-section avatar>
                <q-icon name="qr_code_scanner" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subititle">QR Scanner</q-item-label>
              </q-item-section>
            </q-item> -->
            <q-item
              clickable
              to="/vaccination-tracker/student-records"
              :inset-level="1"
            >
              <q-item-section avatar>
                <q-icon name="group" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subititle"
                  >Student Records</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              clickable
              to="/vaccination-tracker/log-records"
              :inset-level="1"
            >
              <q-item-section avatar>
                <q-icon name="description" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subititle">Log Records</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-separator spaced />
        <q-expansion-item
          v-if="authUser.admin"
          class="text-subtitle1"
          expand-separator
          icon="admin_panel_settings"
          label="Management"
          caption="Administrative"
        >
          <q-list>
            <q-item clickable to="/management/users" :inset-level="1">
              <q-item-section avatar>
                <q-icon name="fas fa-users-gear" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subititle">Users</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item
          class="text-subtitle1"
          expand-separator
          icon="settings"
          label="Settings"
          caption="Preferences"
        >
          <q-list>
            <q-item clickable :inset-level="1">
              <q-item-section avatar>
                <q-icon name="dark_mode" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subititle">Dark</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="dark_mode" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-item @click="logout" clickable class="absolute-bottom q-mb-lg">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1 text-negative"
              >Log Out</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer
      class="bg-grey-1 q-pa-md"
      show-if-above
      v-model="rightDrawerOpen"
      side="right"
      bordered
    >
      <!-- drawer content -->
      <div class="text-h6">Updates</div>
      <div class="text-body2">Under development..</div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, inject, watch } from "vue";
import EssentialLink from "src/components/EssentialLink.vue";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/users";
const userStore = useUserStore();
const $q = useQuasar();

const logout = () => userStore.logoutUser();

const dark_mode = ref(false);

watch(dark_mode, (mode, oldMode) => {
  $q.dark.toggle();
});

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const linksList = [
  {
    title: "Home",
    icon: "home",
    link: "/home",
  },
  // {
  //   title: "Lobby",
  //   icon: "space_dashboard",
  //   link: "/lobby",
  // },
];

// Authuser
const authUser = inject("authUser");
</script>
