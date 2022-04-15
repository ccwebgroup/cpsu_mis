import { boot } from "quasar/wrappers";
import axios from "axios";

export default boot(({ app, store }) => {
  const api = axios.create({
    baseURL: "https://cpsu-mis-api.herokuapp.com/api/",
  });

  app.provide("axios", api);
  store.use(() => ({ api }));
});
