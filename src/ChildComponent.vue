<template>
  <div class="card">
    <DataTable :value="dataSet" tableStyle="min-width: 50rem">
        <Column v-for="col of columns" :key="col.field" :field="col.field" 
                :sortField="col.sortField??col.field" :header="col.header" 
                :severityField="col.severityField??null" :labelField="col.labelField??null">
          <template #body="slotProps">
            <template v-if="col.severityField && col.labelField">
              <Tag :value="slotProps.data[col.field]" :severity="getSeverity(slotProps.data[col.severityField])" />
              <span class="sr-only"> {{ getLabel(slotProps.data[col.labelField]) }}</span>                        
            </template>                                        
            <template v-else-if="col.severityField" >
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
  <div>
    <button @click="runMe">Run Me - I'm a call to the Parent</button>
  </div>
  <div>
    <button @click="runAnotherFunction">Call the Parent with passed parameters and return a value within the Parent</button>
  </div>    
  <div>
    <button @click="callParentUtility">Utility - calls to a function referenced in the Parent</button>
  </div>
  <div>
    <button @click="runYetAnotherFunction">Call the Parent without passing parameters - results to the Child</button>
    <div v-if="result !== null">Result from Parent: {{ result }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dateHelpers from '@helpers/date-helpers.ts'
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
  anotherFunction: (data: { property1: number; property2: number }) => number;
  triggerParentFunction: () => number;
  dataObjectValues: { property1: number; property2: number };  
  utilityFunctionName: string;
  utilityFunctionParams: any;
  columns: ColumnType[];
  dataSet: T[];
  idSet: IdSetConfig;
}

const props = defineProps<ChildProps<any>>();  
const result = ref<number | null>(null);

function getSeverity(key: keyof IdSetConfig): string | undefined {
  const entry = props.idSet[key];
  return entry ? entry.severity : undefined;
}

function getLabel(key: keyof IdSetConfig): string | undefined {
  const entry = props.idSet[key];
  return entry ? entry.severity : undefined;
}

// Create a method to call the custom function from child
const runMe = () => {
  // Call the custom function directly
  props.customFunction();
};

// Call the utility function dynamically
const callParentUtility = () => {
  // Ensure the utility function exists before calling
  if (typeof dateHelpers[props.utilityFunctionName] === 'function') {
    const result = dateHelpers[props.utilityFunctionName](props.utilityFunctionParams);
    alert(`Parent Utility result: ${result}`);
  } else {
    alert(`Utility function ${props.utilityFunctionName} not found in dateHelpers.`);
  }
};

const runAnotherFunction = () => {
  // Call the custom function with the object structure
  const result = props.anotherFunction(props.dataObjectValues);
  alert(`Result from another parent function, this with parameters:  ${result}`);
};  

const runYetAnotherFunction = () => {
  // Trigger the function in the ParentComponent
  result.value = props.triggerParentFunction();
};
//runMe();
//callParentUtility();
//runAnotherFunction();

/*
const nowStr = dayjs().format();

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
<style>
.sr-only {
  border: 0!important;
  clip: rect(.0625rem,.0625rem,.0625rem,.0625rem)!important;
  -webkit-clip-path: inset(50%)!important;
  clip-path: inset(50%)!important;
  height: .0625rem!important;
  margin: -.0625rem!important;
  overflow: hidden!important;
  padding: 0!important;
  position: absolute!important;
  width: .0625rem!important;
  white-space: nowrap!important
}
</style>
