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
          :sent="message.sent"
          :text-color="message.sent ? 'white' : ''"
          :bg-color="message.sent ? 'primary' : 'grey-4'"
        >
          <div style="max-width: 300px">
            <span> {{ message.text }}</span>
            <link-preview
              class="bg-transparent"
              v-if="message.url"
              :url="message.url[0]"
            />
          </div>
          <template v-slot:avatar>
            <q-avatar
              size="45px"
              :color="message.sent ? 'grey-6' : 'primary'"
              class="text-white text-bold q-mx-sm"
            >
              <img
                v-if="message.from.photoURL"
                :src="message.from.photoURL"
                alt=""
              />
              <span v-else>{{ message.from.displayName[0] }}</span>
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

    <!-- place QPageScroller at end of page -->
    <q-page-scroller
      v-show="!loading"
      reverse
      position="top"
      :scroll-offset="20"
      :offset="[0, 18]"
    >
      <q-btn
        fab
        icon="keyboard_arrow_down"
        padding="none xl"
        label="Move"
        color="accent"
      />
    </q-page-scroller>

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
            <q-btn @click="send" :disable="!message" flat round icon="send" />
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
import LinkPreview from "src/components/LinkPreview.vue";
// Import Composables
import { useDateFns } from "src/composables/date-fns";
import { useQuasar } from "quasar";
// Import Stores
import { useMessageStore } from "src/stores/messages";
// Define Stores and COmposables
const messageStore = useMessageStore();
const $q = useQuasar();
const { relativeDate } = useDateFns();
// Methods, Refs and States

const handleURLClick = (preview) => {};

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

const getUrl = (textMessage) => {
  const urlRegex = new RegExp(/(https?:\/\/[^\s]+)/g);
  const urls = textMessage.match(urlRegex);
  return urls;
};

onBeforeUnmount(() => messageStore.unsub());
onBeforeMount(() => messageStore.getMessages({ conversationId: "ccs" }));
const messagesData = computed(() => messageStore.getMessagesByDate);
const message = ref("");
const send = async () => {
  const urls = await getUrl(message.value);
  if (urls) {
    if (urls.length > 1) {
      $q.dialog({
        title: "Sorry, message error.",
        message: "We detected more than 1 url in your message",
      });
    } else {
      const text = message.value.replace(urls, "").trim();

      messageStore.addMessage({
        text: text,
        url: urls,
      });
    }
  }
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
