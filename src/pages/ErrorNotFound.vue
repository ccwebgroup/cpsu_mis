<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <img
        class="ccs_logo"
        src="~assets/logo/ccs-logo.svg"
        alt=""
        style="max-width: 140px"
      />
      <img src="~assets/svg/nothing_here.svg" alt="" style="max-width: 350px" />

      <div class="text-h5" style="opacity: 0.4">
        Oops.. Sorry, nothing here.
      </div>

      <q-btn
        class="q-mt-xl"
        padding="xs xl"
        color="primary"
        rounded
        to="/"
        label="Go Back to Home Page"
        no-caps
      />
    </div>
  </div>
</template>
<style lang="sass">
.ccs_logo
  position: absolute
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
