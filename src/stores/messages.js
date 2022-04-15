import { defineStore } from "pinia";
import { auth, db, firestore } from "src/boot/firebase";

export const useMessageStore = defineStore("messages", {
  state: () => ({
    mesRef: {},
    messages: [],
    subscribe: {},
  }),
  getters: {
    getMessagesByDate: (state) => {
      return state.messages.sort((a, b) => a.createdAt - b.createdAt);
    },
  },

  actions: {
    playTone() {
      // const soundurl = "/src/assets/tones/swift-stone.mp3";
      const soundurl =
        "https://notificationsounds.com/storage/sounds/file-sounds-1235-swift-gesture.mp3";
      const audio = new Audio(soundurl);
      audio.play();
    },

    async addMessage(message) {
      const conRef = firestore.doc(db, "conversation", "ccs");
      const mesRef = firestore.collection(conRef, "messages");
      await firestore.addDoc(mesRef, {
        createdAt: firestore.serverTimestamp(),
        fromId: auth.currentUser.uid,
        text: message,
      });
    },

    subs() {
      firestore.onSnapshot(this.mesRef, (mesSnapshot) => {
        mesSnapshot.docChanges().forEach(async (change) => {
          const mesData = change.doc.data();
          mesData.id = change.doc.id;

          if (change.type === "added") {
            const index = this.messages.findIndex(
              (item) => item.id === change.doc.id
            );

            if (index < 0) {
              const userRef = firestore.doc(db, "users", mesData.fromId);
              const userSnap = await firestore.getDoc(userRef);
              mesData.from = userSnap.data();
              if (userSnap.id == auth.currentUser.uid) mesData.sent = true;
              if (userSnap.id !== auth.currentUser.uid) {
                const check = mesData.createdAt.toDate();
                const current = new Date();
                const from = new Date(Date.now() - 5000);
                if (
                  check.getTime() <= current.getTime() &&
                  check.getTime() >= current.getTime()
                ) {
                  this.playTone();
                }
              }
              if (!change.doc.metadata.hasPendingWrites) {
                mesData.createdAt = mesData.createdAt.toDate();
              } else {
                mesData.createdAt = new Date();
              }
              this.messages.push(mesData);
            }
          }
        });
      });
    },
    unsub() {
      const unsub = firestore.onSnapshot(this.mesRef, () => {});
      unsub();
    },

    getMessages(payload) {
      const conRef = firestore.doc(db, "conversation", payload.conversationId);
      const mesRef = firestore.collection(conRef, "messages");
      this.mesRef = mesRef;
      this.subs();
    },
  },
});
