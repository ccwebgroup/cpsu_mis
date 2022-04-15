<template>
  <q-page ref="pageChat" class="flex column">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="!loading" class="q-pa-sm col column justify-end">
        <q-chat-message
          v-for="message in messagesData"
          :key="message.id"
          :name="message.sent ? '' : message.from.displayName"
          :text="[message.text]"
          :sent="message.sent"
          :text-color="message.sent ? 'white' : ''"
          :bg-color="message.sent ? 'primary' : 'grey-4'"
        >
          <template v-slot:avatar>
            <q-avatar
              size="45px"
              :color="message.sent ? 'grey-6' : 'primary'"
              class="text-white text-bold q-mx-sm"
            >
              {{ message.from.displayName[0] }}
            </q-avatar>
          </template>
          <template v-slot:stamp>
            <div style="font-size: 10px">
              {{ relativeDate(message.createdAt) }}
            </div>
          </template>
        </q-chat-message>
      </div>
    </transition>

    <q-inner-loading :showing="loading">
      <q-spinner-comment size="50px" color="primary" />
    </q-inner-loading>

    <q-footer elevated class="bg-primary q-pa-sm">
      <q-form @submit="send">
        <q-input
          v-model="message"
          bg-color="white"
          dense
          rounded
          outlined
          placeholder="Type here..."
        >
          <template v-slot:after>
            <q-btn :disable="!message" flat round icon="send" />
          </template>
        </q-input>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup>
// Main Imports
import {
  ref,
  onBeforeMount,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
// Import Components
// Import Composables
import { useDateFns } from "src/composables/date-fns";
// Import Stores
import { useMessageStore } from "src/stores/messages";
// Define Stores and COmposables
const messageStore = useMessageStore();
const { relativeDate } = useDateFns();
// Methods, Refs and States

const pageChat = ref();
const scrollToBottom = () => {
  let el = pageChat.value.$el;
  setTimeout(() => {
    window.scrollTo(0, el.scrollHeight);
  }, 20);
};

messageStore.$subscribe((mutation, state) => {
  if (!loading.value) {
    scrollToBottom();
  }
});

onBeforeUnmount(() => messageStore.unsub());
onBeforeMount(() => messageStore.getMessages({ conversationId: "ccs" }));
const messagesData = computed(() => messageStore.getMessagesByDate);
const message = ref("");
const send = () => {
  messageStore.addMessage(message.value);
  message.value = "";
};
const loading = ref(true);
watch(loading, () => scrollToBottom());
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 2000);
});
</script>
