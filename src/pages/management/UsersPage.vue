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
          :pagination="{ rowsPerPage: 15 }"
        >
          <template v-slot:body="props">
            <q-tr>
              <q-td>{{ props.row.displayName }}</q-td>
              <q-td>{{ props.row.email }}</q-td>
              <q-td>{{
                numberSlashFormat(props.row.metadata.creationTime)
              }}</q-td>
              <q-td class="text-center">
                <select
                  @change="setRole"
                  class="role-select text-bold"
                  :class="props.row.role ? '' : 'text-negative'"
                >
                  <option :value="props.row.uid">Not Set</option>
                  <option
                    v-for="(role, i) in roleOptions"
                    :key="i"
                    :value="props.row.uid"
                    :selected="role == props.row.role ? true : false"
                  >
                    {{ role }}
                  </option>
                </select>
              </q-td>
              <q-td>
                <q-btn
                  @click="editUser(props.row)"
                  flat
                  color="primary"
                  round
                  icon="edit"
                />
                <q-btn
                  @click="removeUser(props.row.uid)"
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

<style lang="sass">
.role-select
  width: 100px
  border-radius: 5px
  padding: 3px
</style>

<script setup>
// Main Imports
import { computed, onBeforeMount } from "vue";
// Import Components
import AddEditUSer from "src/components/dialogs/AddEditUser.vue";
// Import Composables
import { uid, useQuasar } from "quasar";
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
    label: "Display Name",
    align: "left",
    required: true,
  },
  {
    label: "Email",
    align: "left",
    required: true,
  },
  {
    label: "Date Registered",
    required: true,
    align: "left",
  },
  {
    label: "Role",
    required: true,
    align: "center",
  },
  {
    label: "Actions",
    align: "left",
  },
];

// Methods, Refs and States
const roleOptions = ["Admin", "Faculty", "Student", "Staff", "Technical"];
const setRole = (e) => {
  const uid = e.target.options[e.target.options.selectedIndex].value;
  const role = e.target.options[e.target.options.selectedIndex].text;
  userStore.setUserRole(uid, role);
};
const editUser = (userData) => {
  if (userData.uid) {
    $q.dialog({
      component: AddEditUSer,
      componentProps: {
        userData: userData,
      },
    });
  }
};
const removeUser = (uid) => userStore.deleteUser(uid);
const usersData = computed(() => userStore.users);
onBeforeMount(() => userStore.getUsers());
const handlerUserDialog = () => {
  $q.dialog({
    component: AddEditUSer,
  });
};
</script>
