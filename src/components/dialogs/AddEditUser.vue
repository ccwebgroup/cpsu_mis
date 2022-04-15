<template>
  <q-dialog ref="dialogRef">
    <q-card style="width: 350px">
      <q-card-section>
        <div class="text-h6 text-center">
          {{ userData ? "Edit" : "Add" }} User
        </div>
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
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            v-model="user.displayName"
            rounded
            dense
            outlined
            placeholder="Display Name"
            :rules="[(val) => !!val || 'Field is required']"
          />
          <q-input
            :type="isPwd ? 'password' : 'text'"
            v-model="user.password"
            rounded
            dense
            outlined
            :placeholder="userData ? 'New Password' : 'Password'"
            :hint="userData ? 'Leave blank if not changing' : ''"
            :rules="[(val) => !!userData || !!val || 'Field is required']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            v-model="user.phoneNumber"
            dense
            outlined
            mask="+63 ### ### ####"
            placeholder="Mobile Number"
          >
            <template v-slot:prepend>
              <q-icon name="phone_android" />
            </template>
          </q-input>
          <div class="row justify-around q-mt-lg">
            <q-btn
              dense
              padding="xs xl"
              color="negative"
              rounded
              outline
              label="Cancel"
              v-close-popup
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
import { reactive, ref, onMounted } from "vue";
import { useDialogPluginComponent } from "quasar";
// Import Stores
import { useUserStore } from "src/stores/users";
// Define Stores and COmposables
const userStore = useUserStore();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const isPwd = ref(true);
const initialState = {
  uid: "",
  email: "",
  password: "",
  displayName: "",
  phoneNumber: "",
};

const props = defineProps(["userData"]);

const user = reactive(initialState);

const save = async () => {
  if (props.userData) {
    await userStore.updateUser(user);
  } else {
    await userStore.addUser(user);
  }
  Object.assign(user, initialState);
  onDialogOK();
};

onMounted(() => {
  const userDetails = props.userData;
  if (props.userData) {
    Object.assign(user, {
      uid: userDetails.uid,
      email: userDetails.email,
      displayName: userDetails.displayName,
      phoneNumber: userDetails.phoneNumber,
    });
  }
});
</script>
