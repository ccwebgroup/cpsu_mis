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
              v-print="printObj"
              dense
              dark
              no-caps
              round
              icon="print"
              color="primary"
            />
            <!-- <q-btn
              dense
              dark
              no-caps
              round
              icon="save"
              color="primary"
              type="submit"
            /> -->
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
                :option-label="(val) => (val === null ? null : val.code)"
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

            <!-- <div class="col-12 col-md-5 column items-center"> -->
            <!-- COurse year and section -->
            <!-- <q-select
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
            </div> -->
          </div>

          <div class="row q-gutter-x-sm q-mt-sm justify-center">
            <div class="col-12 col-md-4">
              <!-- Courses and Section -->
              <q-select
                v-model="schedData.courseId"
                @update:model-value="syncSched('course')"
                dense
                outlined
                use-input
                input-debounce="0"
                hint="Course & Section"
                :options="courseOptions"
                :option-label="(val) => (val === null ? null : val.name)"
                option-value="id"
                emit-value
                map-options
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
            <div class="col-12 col-md-4">
              <!-- Instructor -->
              <q-select
                v-model="schedData.instructorId"
                @update:model-value="syncSched('ins')"
                use-input
                dense
                outlined
                input-debounce="0"
                hint="Instructor"
                :options="insOptions"
                :option-label="(val) => (val === null ? null : val.name)"
                option-value="id"
                emit-value
                map-options
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

            <div class="col-12 col-md-3">
              <!-- Rooms -->
              <q-select
                v-model="schedData.roomId"
                @update:model-value="syncSched('room')"
                dense
                outlined
                use-input
                input-debounce="0"
                hint="Room"
                :options="roomOptions"
                :option-label="(val) => (val === null ? null : val.room)"
                option-value="id"
                emit-value
                map-options
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

          <!-- <q-item-label class="q-mt-md q-mb-sm text-subtitle2"
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
          </div> -->

          <!-- <div class="text-center text-subtitle1 q-mt-md">Schedule Viewer</div> -->
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
            <q-btn
              @click="getScheds"
              color="dark"
              unelevated
              icon="refresh"
              label="Sync"
            />
          </q-card-actions>
          <div id="printMe">
            <div
              id="print-header"
              class="row justify-center q-mb-lg print-only"
            >
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
            <div class="text-h6 text-center text-bold q-mt-md">
              {{ displayScheduleTitle() }}
            </div>
            <div class="q-mx-auto" style="display: flex; max-width: 685px">
              <q-calendar-day
                ref="calendar"
                class="q-mt-sm q-mb-lg"
                view="week"
                :drag-enter-func="onDragEnter"
                :drag-over-func="onDragOver"
                :drag-leave-func="onDragLeave"
                :drop-func="onDrop"
                :weekdays="[1, 2, 3, 4, 5]"
                :interval-start="13"
                :interval-minutes="30"
                :interval-count="27"
                :interval-height="25"
                animated
                bordered
                hooverable
                time-clicks-clamped
                @mousedown-time="onMouseDownTime"
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
                        draggable="true"
                        @dragstart="onDragStart($event, sched)"
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
                                sched.course.name
                                  ? sched.course.name
                                  : "Deleted!"
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
                              {{
                                sched.room.room ? sched.room.room : "Deleted!"
                              }}
                            </div>
                            <div class="text-sm q-mt-sm">
                              {{ formatTime(sched.start) }} -
                              {{ formatTime(sched.end) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </template>
                </template>
              </q-calendar-day>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { schedStore } from "src/stores/scheduler";
import { computed, reactive, ref, watch } from "vue";
import moment from "moment";

import {
  QCalendarDay,
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

const checkSched = (item) => {
  //Check schedules
  let data = null;
  switch (schedMode.value) {
    case "course":
      data = {
        field1: "instructorId",
        fieldId1: item.instructorId,
        field2: "roomId",
        fieldId2: item.roomId,
      };
      break;
    case "ins":
      data = {
        field1: "courseId",
        fieldId1: item.courseId,
        field2: "roomId",
        fieldId2: item.roomId,
      };
      break;
    case "room":
      data = {
        field1: "courseId",
        fieldId1: item.courseId,
        field2: "instructorId",
        fieldId2: item.instructorId,
      };
      break;
  }
  schedStore().checkSched(item.id, data);
};

const displayScheduleTitle = () => {
  let title = "";

  if (schedules.value.length) {
    switch (schedMode.value) {
      case "course":
        title = `${schedules.value[0].course.name}`;
        break;
      case "ins":
        title = `${schedules.value[0].instructor.name}`;
        break;
      case "room":
        title = `${schedules.value[0].room.room}`;
        break;
    }
  }

  return title;
};

const formatTime = (time) => moment(time, "h:mm a").format("h:mm a");
const update = async () => {
  const res = await schedStore().updateSchedule({ ...schedData });
};

const printObj = {
  id: "printMe",
  popTitle: "Invoice",
  standard: "",
  extraHead: '<meta http-equiv="Content-Language"content="en-us"/>',
};

/* const printSched = () => {
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
}; */

const syncSched = (mode) => {
  schedMode.value = mode;
  getScheds();
};

const handleSchedDialog = (sched, newSched) => {
  $q.dialog({
    component: SchedForm,
    componentProps: {
      sched: sched,
      newSched: newSched,
    },
  });
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

function onDragStart(event, item) {
  event.dataTransfer.dropEffect = "copy";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("ID", item.id);
  Object.assign(schedData, { ...item });
  checkSched(item);
}

function onDragEnter(e, type, scope) {
  e.preventDefault();
  return true;
}

function onDragOver(e, type, scope) {
  e.preventDefault();
  return true;
}

function onDragLeave(e, type, scope) {
  return false;
}

const hidePopUP = ref(false);
function onDrop(e, type, scope) {
  const day = days[scope.timestamp.weekday];
  const start = moment(scope.timestamp.time, "h:mm a").format("h:mm a");
  const end = moment(scope.timestamp.time, "h:mm a")
    .add(schedData.duration, "m")
    .format("h:mm a");

  // Fill form update
  schedData.day = day;
  schedData.start = scope.timestamp.time;
  schedData.end = moment(end, "h:mm a").format("HH:mm");
  schedData.duration = schedData.duration / 60;
  if (!hidePopUP.value) {
    $q.dialog({
      title: "Change?",
      message: `<div class='text-center'>
          <div class='text-bold text-subtitle1 text-primary'>${day.day}</div>
          <div class='text-bold text-negative'>${start} - ${end}</div>
        </div>`,
      html: true,
      cancel: true,
      options: {
        type: "checkbox",
        model: [],
        items: [
          {
            label: "Do not show this message again.",
            value: true,
          },
        ],
      },
    }).onOk((data) => {
      if (data[0]) hidePopUP.value = data[0];
      update();
    });
  } else {
    update();
  }
  return false;
}

function leftClick(e) {
  return e.button === 0;
}

function onMouseDownTime({ scope, event }) {
  const i = scope.timestamp.weekday;
  if (leftClick(event)) {
    handleSchedDialog(
      {
        start: scope.timestamp.time,
        day: days[i],
        subjectId: schedData.subjectId,
        courseId: schedData.courseId,
        instructorId: schedData.instructorId,
        roomId: schedData.roomId,
      },
      true
    );
  }
}

function badgeClasses(event, type) {
  const isHeader = type === "header";
  return {
    [`text-white ${event.bgColor}`]: true,
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
  border: 1px solid white

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
