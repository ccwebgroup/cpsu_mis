<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px">
      <q-card-section class="text-h6"
        >{{ subj ? "Edit" : "Add" }} Subject</q-card-section
      >
      <q-card-section>
        <q-form @submit="subj ? update() : save()" class="q-gutter-y-md">
          <q-input
            dense
            v-model="subjData.code"
            outlined
            placeholder="Subject code"
            :rules="[(val) => !!val || 'Subject code is required!']"
          />
          <q-input
            v-model="subjData.desc"
            dense
            placeholder="Subject description"
            :rules="[(val) => !!val || 'Subject description is required!']"
          />
          <div class="row items-center q-gutter-x-xs">
            <div class="form-control">
              <q-input
                dense
                outlined
                v-model="subjData.units"
                hint="Units"
                mask="#"
                :rules="[(val) => !!val || 'Field is required!']"
              />
            </div>
            <div class="form-control">
              <q-input
                dense
                outlined
                v-model="subjData.lab"
                hint="Lab"
                mask="#"
                :rules="[(val) => !!val || 'Field is required!']"
              />
            </div>

            <div class="form-control">
              <q-input
                dense
                outlined
                v-model="subjData.lec"
                hint="Lec"
                mask="#"
                :rules="[(val) => !!val || 'Field is required!']"
              />
            </div>

            <div class="form-control">
              <q-input
                dense
                outlined
                :model-value="getTotalHours()"
                hint="Total hours"
                readonly
              />
            </div>
          </div>
          <q-card-actions align="right" class="q-gutter-x-sm">
            <q-btn
              type="submit"
              no-caps
              flat
              :label="subj ? 'Update' : 'Save'"
            />
            <q-btn no-caps flat label="Cancel" color="negative" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="sass" scoped>
.form-control
  max-width: 80px
</style>

<script setup>
import { reactive } from "vue";
import { useDialogPluginComponent } from "quasar";
import { schedStore } from "stores/scheduler";

defineEmits([...useDialogPluginComponent.emits]);
const props = defineProps({
  subj: Object,
});
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
  useDialogPluginComponent();

const subjData = reactive({
  id: "",
  code: "",
  desc: "",
  units: 0,
  lab: 0,
  lec: 0,
  totalHours: 0,
});

if (props.subj) {
  Object.assign(subjData, props.subj);
}

function getTotalHours() {
  const total = parseInt(subjData.lec) + parseInt(subjData.lab);
  subjData.totalHours = total;
  return total;
}

const save = async () => {
  const res = await schedStore().addSubject({ ...subjData });
  if (res) onDialogOK();
};

const update = async () => {
  const res = await schedStore().updateData(subjData.id, "subjects", {
    ...subjData,
  });
  if (res) onDialogOK();
};
</script>
