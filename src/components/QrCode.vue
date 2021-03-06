<template>
  <q-card class="q-mx-auto" style="max-width: 300px">
    <q-card-section class="flex flex-center">
      <div ref="canvas"></div>
    </q-card-section>

    <q-card-section class="q-py-none">
      <q-item dense>
        <q-item-section avatar>
          <q-icon color="primary" name="person" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle2">
            {{
              `${studentData.lname}, ${studentData.fname} ${studentData.mname}.`
            }}</q-item-label
          >
          <q-item-label caption>Student Name</q-item-label>
        </q-item-section>
      </q-item>
      <div class="text-center text-subtitle1"></div>
      <div class="text-center text-caption q-mt-sm">
        Record Id: {{ studentData.id }}
      </div>
    </q-card-section>

    <q-card-actions class="q-py-md" align="center">
      <q-btn
        @click="download"
        no-caps
        color="primary"
        padding="xs lg"
        label="Download"
      />
      <q-btn
        padding="xs lg"
        no-caps
        outline
        color="negative"
        label="Close"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import QRCodeStyling from "qr-code-styling";

const props = defineProps({
  studentData: {
    type: Object,
  },
});

const download = () => {
  qrCode.download({
    name: `${props.studentData.lname}-${props.studentData.fname}`,
    extension: "png",
  });
};

const options = {
  width: 250,
  height: 250,
  data: props.studentData.id,
  margin: 1,
  qrOptions: {
    typeNumber: "0",
    mode: "Byte",
    errorCorrectionLevel: "L",
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
  },
  dotsOptions: {
    type: "extra-rounded",
    color: "#6a1a4c",
    gradient: {
      type: "linear",
      rotation: 0,
      colorStops: [
        {
          offset: 0,
          color: "#170250",
        },
        {
          offset: 1,
          color: "#290363",
        },
      ],
    },
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  image: "logo/cpsu-logo.jpg",
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 1,
    margin: 0,
  },
  dotsOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: "#6a1a4c",
      color2: "#6a1a4c",
      rotation: "0",
    },
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#000000",
  },
  cornersSquareOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: "#000000",
      color2: "#000000",
      rotation: "0",
    },
  },
  cornersDotOptions: {
    type: "dot",
    color: "#000000",
  },
  cornersDotOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: "#000000",
      color2: "#000000",
      rotation: "0",
    },
  },
  backgroundOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: "#ffffff",
      color2: "#ffffff",
      rotation: "0",
    },
  },
};

const qrCode = new QRCodeStyling(options);
const canvas = ref();
onMounted(() => {
  qrCode.append(canvas.value);
});
</script>
