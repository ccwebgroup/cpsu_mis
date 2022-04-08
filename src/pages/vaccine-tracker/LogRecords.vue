<template>
  <q-page padding>
    <q-card class="q-pa-sm">
      <q-card-actions>
        <q-btn
          to="/vaccination-tracker/qr-scanner"
          padding="xs lg"
          no-caps
          rounded
          color="primary"
          icon="qr_code_scanner"
          label="Qr Code Scanner"
        />
      </q-card-actions>

      <!-- Logs Table -->
      <q-table title="Log Records" :rows="allVaxLogs" :columns="logColumns">
        <template v-slot:top-right>
          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="exportTable"
          />
        </template>
        <template v-slot:body="props">
          <q-tr>
            <q-td>{{
              `${props.row.studentInfo.lname}, ${props.row.studentInfo.fname} ${props.row.studentInfo.mname}.`
            }}</q-td>
            <q-td>{{ logDateFormat(props.row.timeIn.toDate()) }}</q-td>
            <q-td>{{ logTimeFormat(props.row.timeIn.toDate()) }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onBeforeMount } from "vue";
import { exportFile, useQuasar } from "quasar";
// Import Composables
import { useDate } from "src/composables/qdate";
// Import Stores
import { useVaxLogStore } from "src/stores/vaccination-logs";
// Define stores and composables
const vaxLogStore = useVaxLogStore();
const { logDateFormat, logTimeFormat, fileDateFormat } = useDate();
const $q = useQuasar();

//  Methods
const wrapCsvValue = (val, formatFn) => {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
};

const exportTable = () => {
  const content = [logColumns.map((col) => wrapCsvValue(col.label))]
    .concat(
      allVaxLogs.value.map((row) =>
        logColumns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const status = exportFile(
    "Log-records-" + fileDateFormat(new Date()) + ".csv",
    content,
    "text/csv"
  );

  if (status !== true) {
    $q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
};

// Log Table Data
const logColumns = [
  {
    label: "Student Name",
    name: "Student Name",
    field: (row) =>
      `${row.studentInfo.lname}, ${row.studentInfo.fname} ${row.studentInfo.mname}.`,
    align: "center",
    required: true,
  },
  {
    label: "Date",
    name: "Date",
    field: (row) => row.timeIn,
    format: (val) => logDateFormat(val.toDate()),
    align: "left",
    required: true,
    sortable: true,
  },
  {
    label: "Time-in",
    name: "Time-in",
    field: (row) => row.timeIn,
    format: (val) => logTimeFormat(val.toDate()),
    align: "left",
    required: true,
    sortable: true,
  },
];
const allVaxLogs = computed(() => vaxLogStore.allVaxlogs);
onBeforeMount(() => vaxLogStore.getAllVaxlogs());
</script>
