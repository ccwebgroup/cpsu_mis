import { boot } from "quasar/wrappers";
import { QrStream } from "vue3-qr-reader";
import print from "vue3-print-nb";

export default boot(async ({ app }) => {
  app.component("qr-stream", QrStream);
  app.use(print);
});
