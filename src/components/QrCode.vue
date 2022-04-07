<template>
  <q-card style="width: 400px">
    <q-card-section class="flex flex-center">
      <div id="canvas"></div>
    </q-card-section>

    <q-card-actions class="q-py-md" align="center">
      <q-btn
        @click="download"
        no-caps
        color="primary"
        padding="xs xl"
        label="Download"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { onMounted } from "vue";
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
  width: 300,
  height: 300,
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

onMounted(async () => {
  qrCode.append(document.getElementById("canvas"));
});
</script>
