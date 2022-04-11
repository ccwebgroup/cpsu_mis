<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="~assets/img/ccs-logo.png" />
          </q-avatar>
          MIS-Sys
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <q-list class="q-mt-md" padding dense>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />

        <q-expansion-item
          class="text-subtitle1"
          expand-separator
          icon="vaccines"
          label="Vaccination Tracker"
          caption="System for students."
          default-opened
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

        <q-expansion-item
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from "vue";
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
const linksList = [
  {
    title: "Dashboard",
    icon: "dashboard",
    link: "/dashboard",
  },
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
