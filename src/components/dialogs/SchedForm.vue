<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section>Update Schedule</q-card-section>
      <q-card-section>
        <q-form @submit="update">
          <div class="row q-gutter-x-sm justify-evenly">
            <div class="col-12 col-md-5">
              <!-- Subject -->
              <q-select
                dense
                outlined
                v-model="schedData.subjectId"
                use-input
                input-debounce="0"
                label="Subject"
                :options="subOptions"
                option-label="code"
                option-value="id"
                emit-value
                map-options
                style="width: 250px"
                @filter="filterSub"
                :rules="[(val) => !!val || 'Subject is required!']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-5">
              <!-- COurse year and section -->
              <q-select
                v-model="schedData.courseId"
                dense
                outlined
                use-input
                input-debounce="0"
                label="Course & Section"
                :options="courseOptions"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                style="width: 250px"
                @filter="filterCourse"
                :rules="[(val) => !!val || 'Course & section is required!']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div class="row q-gutter-x-sm q-mt-sm justify-evenly">
            <div class="col-12 col-md-5">
              <!-- Instructor -->
              <q-select
                v-model="schedData.instructorId"
                use-input
                dense
                outlined
                input-debounce="0"
                label="Instructor"
                :options="insOptions"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                style="width: 250px"
                @filter="filterIns"
                :rules="[(val) => !!val || 'Instructor is required!']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-5">
              <!-- Rooms -->
              <q-select
                v-model="schedData.roomId"
                dense
                outlined
                use-input
                input-debounce="0"
                label="Room"
                :options="roomOptions"
                option-label="room"
                option-value="id"
                emit-value
                map-options
                style="width: 250px"
                @filter="filterRooms"
                :rules="[(val) => !!val || 'Room is required!']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <q-item-label class="q-mt-md q-mb-sm text-subtitle2"
            >Schedule</q-item-label
          >
          <div class="row justify-evenly q-gutter-xs">
            <div class="col-12 col-md-3">
              <q-select
                v-model="schedData.day"
                outlined
                dense
                :options="days"
                option-value="id"
                option-label="day"
                label="Day"
                :rules="[(val) => !!val || 'Day is required!']"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="schedData.start"
                dense
                outlined
                type="time"
                hint="Start"
                :rules="[(val) => !!val || 'Start time is required!']"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="schedData.end"
                dense
                outlined
                type="time"
                hint="End"
                :rules="[(val) => !!val || 'End time is required!']"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-input
                :model-value="getDuration()"
                dense
                outlined
                type="number"
                hint="Duration"
                readonly
              >
                <template v-slot:append
                  ><span class="text-caption">hrs</span></template
                >
              </q-input>
            </div>
          </div>

          <q-card-actions align="right">
            <q-btn
              @click="remove"
              unelevated
              dense
              no-caps
              color="negative"
              label="Delete"
            />
            <q-btn
              type="submit"
              unelevated
              dense
              no-caps
              color="primary"
              label="Update"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { schedStore } from "stores/scheduler";
import { parseTime } from "@quasar/quasar-ui-qcalendar/src/QCalendarDay.js";

defineEmits([...useDialogPluginComponent.emits]);
const props = defineProps({
  sched: Object,
});

const schedData = reactive({
  id: "",
  subjectId: "",
  courseId: "",
  instructorId: "",
  roomId: "",
  day: "",
  start: "",
  end: "",
  duration: "",
});

Object.assign(schedData, props.sched);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const days = [
  { id: 0, day: "Sunday" },
  { id: 1, day: "Monday" },
  { id: 2, day: "Tuesday" },
  { id: 3, day: "Wednesday" },
  { id: 4, day: "Thursday" },
  { id: 5, day: "Friday" },
  { id: 6, day: "saturday" },
];
const displayDay = (i) => {
  return days[i].day;
};

const subjects = computed(() => schedStore().subjects);
const subOptions = ref(subjects.value);
const filterSub = (val, update) => {
  if (val === "") {
    update(() => {
      subOptions.value = subjects.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    subOptions.value = subjects.value.filter(
      (v) => v.code.toLowerCase().indexOf(needle) > -1
    );
  });
};

const courses = computed(() => schedStore().courses);
const courseOptions = ref(courses.value);
const filterCourse = (val, update) => {
  if (val === "") {
    update(() => {
      courseOptions.value = courses.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    courseOptions.value = courses.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const instructors = computed(() => schedStore().instructors);
const insOptions = ref(instructors.value);
const filterIns = (val, update) => {
  if (val === "") {
    update(() => {
      insOptions.value = instructors.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    insOptions.value = instructors.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const rooms = computed(() => schedStore().rooms);
const roomOptions = ref(rooms.value);
const filterRooms = (val, update) => {
  if (val === "") {
    update(() => {
      roomOptions.value = rooms.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    roomOptions.value = rooms.value.filter(
      (v) => v.room.toLowerCase().indexOf(needle) > -1
    );
  });
};

function getDuration() {
  const mins = parseTime(schedData.end) - parseTime(schedData.start);
  const duration = mins / 60;
  schedData.duration = duration;
  return duration;
}

const update = async () => {
  const res = await schedStore().updateSchedule({ ...schedData });
  if (res) onDialogOK();
};

const remove = async () => {
  const res = await schedStore().deleteSchedule(schedData.id);
  if (res) onDialogOK();
};
</script>
