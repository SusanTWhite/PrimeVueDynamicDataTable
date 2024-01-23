<template>
  <div class="card">
        <DataTable :value="dataSet" tableStyle="min-width: 50rem">
            <Column v-for="col of columns" :key="col.field" :field="col.field" 
                    :sortField="col.sortField??col.field" :header="col.header" 
                    :severityField="col.severityField??null" :labelField="col.labelField??null">
                <template #body="slotProps">                    
                    <template v-if="col.severityField" >
                        <Tag :value="slotProps.data[col.field]" :severity="getSeverity(slotProps.data[col.severityField])" />
                    </template>
                    <template v-else-if="col.labelField">
                        {{ getLabel(slotProps.data[col.labelField]) }}
                    </template>
                    <template v-else>
                        {{ slotProps.data[col.field] }}
                    </template>
                </template>                
            </Column>
        </DataTable>
    </div>
    
</template>

<script setup lang="ts">
//import dayjs from 'dayjs';
//import constants from '@helpers/constants.ts';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

type SeveritySet = {
	severity: string;
	label: string;
  };
 
type IdSetConfig = Record<string, SeveritySet>;

interface ColumnType {
  field: string;
  header: string;
  sortField?: string;
  severityField?: string;
  labelField?: string;
}

interface ChildProps<T> {
  customFunction: () => void;
  columns: ColumnType[];
  dataSet: T[];
  idSet: IdSetConfig;
}

const props = defineProps<ChildProps<any>>();

function getSeverity(key: keyof IdSetConfig): string | undefined {
  const entry = props.idSet[key];
  return entry ? entry.severity : undefined;
}

function getLabel(key: keyof IdSetConfig): string | undefined {
  const entry = props.idSet[key];
  return entry ? entry.severity : undefined;
}

/*
const nowStr = dayjs().format();

const runCustomFunction = () => {
  props.customFunction();
};

function getSeverityFromField(columns: Column[], field: keyof Column, value: string): string | null {
  const column = columns.find((col) => 'field' in col && col.field === field && 'severityField' in col && col.severityField !== undefined);

  if (column && 'severityField' in column) {
    const severity = getSeverity(value);
    return severity !== undefined ? severity : null;
  }

  return null
}

function getLabelFromField(columns: Column[], field: keyof Column, value: string): string | null {
  const column = columns.find((col) => 'field' in col && col.field === field && 'labelField' in col && col.labelField !== undefined);

  if (column && 'labelField' in column) {
    const label = getLabel(value);
    return label !== undefined ? label : null;
  }

  return null
}
*/
</script>
