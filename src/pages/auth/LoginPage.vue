<template>
  <q-page padding>
    <q-card flat class="q-mt-xl q-mx-auto q-pt-md" style="max-width: 350px">
      <div class="text-center">
        <q-avatar size="110px">
          <img src="~assets/img/ccs-logo.png" alt="" />
        </q-avatar>
        <div class="text-h6">MIS-Sys</div>
      </div>
      <q-card-section>
        <q-form @submit="login" class="q-gutter-sm q-pa-lg">
          <q-input
            v-model="credentials.email"
            type="email"
            :rules="[(val) => !!val || 'Field is required']"
            dense
            rounded
            outlined
            placeholder="Username or Email"
          />
          <q-input
            v-model="credentials.password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[(val) => !!val || 'Field is required']"
            dense
            rounded
            outlined
            placeholder="Password"
          >
            <template v-slot:append>
              <q-icon
                @click="isPwd = !isPwd"
                :name="isPwd ? 'visibility_off' : 'visibility'"
              />
            </template>
          </q-input>

          <div class="text-center q-px-sm">
            <q-btn
              type="submit"
              class="full-width"
              color="primary"
              label="Log in"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
// Main Imports
import { reactive, ref } from "vue";
// Import Components
// Import Composables
// Import Stores
import { useUserStore } from "src/stores/users";
// Define Stores and COmposables
const userStore = useUserStore();
// Methods, Refs and States
const isPwd = ref(true);
const credentials = reactive({
  email: "",
  password: "",
});

const login = () => userStore.loginUser(credentials);
</script>
