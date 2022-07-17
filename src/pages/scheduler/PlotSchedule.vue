<template>
  <q-page padding class="bg-grey-1">
    <q-card>
      <q-card-section class="text-h6">Plot Schedule</q-card-section>
      <q-card-section>
        <q-form @submit="save">
          <div
            class="fixed-bottom z-top q-mx-auto text-center q-mb-sm rounded-borders q-pa-xs q-gutter-x-sm"
            style="max-width: 200px"
          >
            <q-btn
              @click="printSched"
              dense
              dark
              no-caps
              round
              icon="print"
              color="primary"
            />
            <q-btn
              dense
              dark
              no-caps
              round
              icon="save"
              color="primary"
              type="submit"
            />
          </div>

          <div class="row q-gutter-x-sm justify-center">
            <div class="col-12 col-md-5 column items-center">
              <!-- Subject -->
              <q-select
                dense
                outlined
                v-model="schedData.subjectId"
                use-input
                input-debounce="0"
                hint="Subject"
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

            <div class="col-12 col-md-5 column items-center">
              <!-- COurse year and section -->
              <q-select
                v-model="schedData.courseId"
                dense
                outlined
                use-input
                input-debounce="0"
                hint="Course & Section"
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

          <div class="row q-gutter-x-sm q-mt-sm justify-center">
            <div class="col-12 col-md-5 column items-center">
              <!-- Instructor -->
              <q-select
                v-model="schedData.instructorId"
                use-input
                dense
                outlined
                input-debounce="0"
                hint="Instructor"
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

            <div class="col-12 col-md-5 column items-center">
              <!-- Rooms -->
              <q-select
                v-model="schedData.roomId"
                dense
                outlined
                use-input
                input-debounce="0"
                hint="Room"
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
                hint="Day"
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

          <div class="text-center text-subtitle1 q-mt-md">Schedule Viewer</div>
          <q-card-actions align="center" class="q-py-none">
            <q-btn-toggle
              v-model="schedMode"
              toggle-color="primary"
              :options="[
                { label: 'Course', value: 'course' },
                { label: 'Instructor', value: 'ins' },
                { label: 'Room', value: 'room' },
              ]"
            />
            <q-btn @click="getScheds" flat round icon="refresh" />
          </q-card-actions>

          <div id="print-header" class="print-only">
            <div class="flex">
              <q-avatar size="70px">
                <img src="~assets/png/cpsu-logo.png" />
              </q-avatar>
              <div class="q-py-md q-ml-md">
                <span class="text-bold text-subtitle1 text-center">
                  CENTRAL PHILIPPINES STATE UNIVERSITY
                </span>
                <div class="text-center">
                  San Carlos City, Negros Occidental
                </div>
              </div>
            </div>
          </div>

          <div
            id="printMe"
            class="q-mx-auto"
            style="display: flex; max-width: 745px"
          >
            <q-calendar-day
              ref="calendar"
              class="q-mt-md q-mb-lg"
              view="week"
              :weekdays="[1, 2, 3, 4, 5]"
              :interval-start="13"
              :interval-minutes="30"
              :interval-count="24"
              animated
              bordered
            >
              <template #head-intervals>
                <div class="fit row justify-center text-subtitle1 text-bold">
                  Time
                </div>
              </template>

              <template #head-day="{ scope: { timestamp } }">
                <div class="fit row justify-center">
                  {{ displayDay(timestamp.weekday) }}
                </div>
              </template>

              <template
                #day-body="{
                  scope: { timestamp, timeStartPos, timeDurationHeight },
                }"
              >
                <template v-for="sched in schedules" :key="sched.id">
                  <transition
                    appear
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut"
                  >
                    <div
                      @click="handleSchedDialog(sched)"
                      v-if="sched.day.id === timestamp.weekday"
                      class="my-sched"
                      :class="badgeClasses(sched, 'body')"
                      :style="
                        badgeStyles(
                          sched,
                          'body',
                          timeStartPos,
                          timeDurationHeight
                        )
                      "
                    >
                      <div class="title text-center">
                        <div>
                          <div class="text-caption">
                            {{
                              sched.subject.code
                                ? sched.subject.code
                                : "Deleted!"
                            }}
                          </div>
                          <div class="text-caption">
                            {{
                              sched.course.name ? sched.course.name : "Deleted!"
                            }}
                          </div>
                          <div class="text-caption">
                            {{
                              sched.instructor.name
                                ? sched.instructor.name
                                : "Deleted!"
                            }}
                          </div>
                          <div class="text-caption">
                            {{ sched.room.room ? sched.room.room : "Deleted!" }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </template>
              </template>
            </q-calendar-day>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { schedStore } from "src/stores/scheduler";
import { computed, reactive, ref, watch } from "vue";

import {
  QCalendarDay,
  getDayTimeIdentifier,
  getDateTime,
  addToDate,
  parseTimestamp,
  parseTime,
} from "@quasar/quasar-ui-qcalendar/src/QCalendarDay.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass";
import { useQuasar } from "quasar";
import SchedForm from "src/components/dialogs/SchedForm.vue";

const $q = useQuasar();
const schedMode = ref("course");
const schedules = computed(() => schedStore().schedules);

const printSched = () => {
  // Get HTML to print from element
  const header = document.querySelector("#print-header").innerHTML;
  const div = document.querySelector("#printMe").innerHTML;

  // Get all stylesheets HTML
  let stylesHtml = "";
  for (const node of [
    ...document.querySelectorAll('link[rel="stylesheet"], style'),
  ]) {
    stylesHtml += node.outerHTML;
  }

  // Open the print window
  const WinPrint = window.open(
    "",
    "",
    "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
  );

  WinPrint.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
  </head>

  <body>
   <div class="row justify-center q-mb-md">
      ${header}
   </div>
    <div style="width: 685px;">
      ${div}
    </div>
  </body>
</html>`);

  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  WinPrint.close();
};

const handleSchedDialog = (sched) => {
  $q.dialog({
    component: SchedForm,
    componentProps: {
      sched: sched,
    },
  }).onOk(() => getScheds());
};

watch(schedMode, (newVal) => {
  if (newVal) {
    getScheds();
  }
});

async function getScheds() {
  let field = "";
  let fieldId = "";
  switch (schedMode.value) {
    case "course":
      field = "courseId";
      fieldId = schedData.courseId;
      break;
    case "ins":
      field = "instructorId";
      fieldId = schedData.instructorId;
      break;
    case "room":
      field = "roomId";
      fieldId = schedData.roomId;
      break;
  }
  const res = await schedStore().getSchedules(field, fieldId);
}

async function save() {
  const res = await schedStore().addSchedule({ ...schedData });
  if (res) return;
}

function getDuration() {
  const mins = parseTime(schedData.end) - parseTime(schedData.start);
  const duration = mins / 60;
  schedData.duration = duration;
  return duration;
}
/*
Calendar settings
 */
const calendar = ref(null);

const schedsMap = computed(() => {
  const map = {};
  // scheds.forEach(sched => (map[ sched.date ] = map[ sched.date ] || []).push(sched))
  scheds.forEach((sched) => {
    if (!map[sched.date]) {
      map[sched.date] = [];
    }
    map[sched.date].push(sched);
    if (sched.days) {
      let timestamp = parseTimestamp(sched.date);
      let days = sched.days;
      do {
        timestamp = addToDate(timestamp, { day: 1 });
        if (!map[timestamp.date]) {
          map[timestamp.date] = [];
        }
        map[timestamp.date].push(sched);
      } while (--days > 0);
    }
  });
  return map;
});

function badgeClasses(event, type) {
  const isHeader = type === "header";
  return {
    [`text-white bg-purple`]: true,
    "full-width": !isHeader && (!event.side || event.side === "full"),
    "left-side": !isHeader && event.side === "left",
    "right-side": !isHeader && event.side === "right",
    "rounded-border": true,
  };
}

function badgeStyles(
  event,
  type,
  timeStartPos = undefined,
  timeDurationHeight = undefined
) {
  const s = {};
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.start) + "px";
    s.height = timeDurationHeight(event.duration) + "px";
  }
  s["align-items"] = "flex-start";
  return s;
}
/*
Calendar settings
 */

const scheds = [
  {
    end: "8:00",
    start: "7:00",
    instructorId: "zRLvxZk4i3zq2MyTEIav",
    day: 1,
    duration: 60,
    createdAt:
      "[native Date Sun Jul 17 2022 13:46:26 GMT+0800 (Philippine Standard Time)]",
    roomId: "5Cnz3jTo8SHs9kLjCxGo",
    courseId: "fr0Gn1KOQGcL5eQ1yTAB",
    subjectId: "EFyypu2y0EfpDZBLnn6B",
    title: "PLOTED",
    id: 1,
    weekday: 1,
    bgcolor: "purple",
  },
  {
    id: 2,
    title: "PLOTED",
    weekday: 3,
    start: "9:00",
    end: "10:30",
    duration: 120,
    bgcolor: "purple",
  },
];

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

const schedData = reactive({
  subjectId: "",
  courseId: "",
  instructorId: "",
  roomId: "",
  day: "",
  start: "",
  end: "",
  duration: "",
});

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

const getData = () => schedStore().getAllData();

getData();
</script>
<style lang="sass" scoped>
.my-sched
  position: absolute
  font-size: 12px
  justify-content: center
  margin: 0 1px
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.full-width
  left: 0
  width: calc(100% - 2px)

.left-side
  left: 0
  width: calc(50% - 3px)

.right-side
  left: 50%
  width: calc(50% - 3px)

.rounded-border
  border-radius: 2px
</style>
