<template>
  <q-page padding>
    <q-card>
      <q-card-actions class="q-pa-md">
        <q-btn
          @click="handlerUserDialog"
          no-caps
          padding="xs lg"
          label="Add User"
          icon="fas fa-user-plus"
          color="primary"
        />
      </q-card-actions>

      <q-card-section>
        <q-table
          dense
          flat
          title="Users Table"
          :rows="usersData"
          :columns="userCols"
        >
          <template v-slot:body="props">
            <q-tr>
              <q-td>{{ props.row.username }}</q-td>
              <q-td>{{ numberSlashFormat(props.row.createdAt) }}</q-td>
              <q-td>
                <q-btn
                  @click="removeUser(props.row)"
                  flat
                  color="negative"
                  round
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
// Main Imports
import { computed, onBeforeMount } from "vue";
// Import Components
import AddEditUSer from "src/components/dialogs/AddEditUser.vue";
// Import Composables
import { useQuasar } from "quasar";
import { useDate } from "src/composables/qdate";
// Import Stores
import { useUserStore } from "src/stores/users";
// Define Stores and COmposables
const userStore = useUserStore();
const $q = useQuasar();
const { numberSlashFormat } = useDate();
// Table Data
const userCols = [
  {
    label: "Username",
    align: "left",
    required: true,
  },
  {
    label: "Date Registered",
    required: true,
    align: "left",
  },
  {
    label: "Actions",
    align: "left",
  },
];
// Methods, Refs and States
const removeUser = (user) => userStore.deleteUser(user);
const usersData = computed(() => userStore.users);
onBeforeMount(() => userStore.getUsers());
const handlerUserDialog = () => {
  $q.dialog({
    component: AddEditUSer,
  });
};
</script>
