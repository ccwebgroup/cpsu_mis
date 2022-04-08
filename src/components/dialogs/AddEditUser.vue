<template>
  <q-dialog ref="dialogRef">
    <q-card style="width: 350px">
      <q-card-section>
        <div class="text-h6">Add User</div>
        <q-form
          @submit="save"
          ref="userForm"
          class="q-gutter-sm q-py-md"
          autocomplete="off"
        >
          <q-input
            type="email"
            v-model="user.email"
            dense
            filled
            placeholder="Email"
            :rules="[(val) => !!val || 'Field is required']"
          />
          <q-input
            :type="isPwd ? 'password' : 'text'"
            v-model="user.password"
            rounded
            dense
            outlined
            placeholder="Password"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-select
            v-model="user.role"
            outlined
            dense
            :options="['Administrator', 'Staff', 'Faculty', 'Technical']"
            hint="User Management Role"
            :rules="[(val) => !!val || 'Field is required']"
          >
            <template v-slot:prepend>
              <q-icon name="manage_accounts" />
            </template>
          </q-select>
          <div class="row justify-around q-mt-lg">
            <q-btn
              dense
              padding="xs xl"
              color="negative"
              rounded
              outline
              label="Cancel"
            />
            <q-btn
              type="submit"
              dense
              padding="xs xl"
              color="primary"
              rounded
              label="Save"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useDialogPluginComponent } from "quasar";
// Import Stores
import { useUserStore } from "src/stores/users";
// Define Stores and COmposables
const userStore = useUserStore();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const isPwd = ref(true);
const initialState = {
  email: "",
  password: "",
  role: "",
};

const user = reactive(initialState);

const save = async () => {
  await userStore.addUser(user);
  Object.assign(user, initialState);
  onDialogOK();
};
</script>
