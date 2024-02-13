<template>
  <div class="card">   
    <DataTable :value="dataSet" ref="dt" tableStyle="min-width: 50rem">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <InputText
              style="width: 75%"
              v-model="updateSearch"
              type="text"
              placeholder="Search by name using ENTER to submit or ESCAPE to reset" 
              @keyup.enter="searchFunction" 
              @keyup.escape="searchFunction" />
              <Button label="Add" icon="pi pi-plus" class="ml-2" @click="addNew" />
          </div>
        </template>      
        <Column v-for="col of columns" :key="col.field" :field="col.field" 
                :sortField="col.sortField??col.field" :header="col.header" 
                :severityField="col.severityField??null" :labelField="col.labelField??null" :sortable="col.sortable??false">
                <!--   :exportable="col.exportable??false"-->
          <template #body="slotProps">
            <div v-if="col.field!=constants.fieldName.buttons"> 
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
            </div>
            <template v-if="col.field==constants.fieldName.buttons">
              <Button
                  v-for="(button, index) in slotProps.data.buttons"
                  :key="index"
                  :label="button.label"
                  :severity="button.severity"
                  :disabled="button.disabled"
                  @click="buttonClick(index)" >
                 {{ button.label }}
              </Button>  
                <!-- Button label="Edit" severity="info" @click="edit()" / -->
                <!--Button :label="Edit" :severity="info" :disabled="disabled" @click="edit()" / -->                
                <!-- class="mr-2" @click="edit(slotProps.data)" disabled-->           
            </template >         
          </template>
        </Column>
        <template #footer>
          <!--div style="text-align: right">
            <Button icon="pi pi-external-link" label="Export as CSV" @click="exportCSV()" />
          </div -->
        </template>
    </DataTable>
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
import { ref, watch } from 'vue';
import constants from '@helpers/constants.ts'
import dateHelpers from '@helpers/date-helpers.ts'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

type SeveritySet = {
	severity: string;
	label: string;
  };
 
type IdSetConfig = Record<string, SeveritySet>;

interface ColumnType {
  field: string;
  header: string;
  sortable?: boolean;
  sortField?: string;
  severityField?: string;
  labelField?: string;
  //exportable?: boolean;
}

interface ButtonType {
  label: string;
  severity: string;
  disabled: boolean;
}

interface ChildProps<T> {
  anotherFunction: (data: { property1: number; property2: number }) => number;
  triggerParentFunction: () => number;
  searchFunction: (param1: string) => Promise<void>; 
  addNew: () => void;
  buttonClick: (index: number) => void;
  dataObjectValues: { property1: number; property2: number };  
  utilityFunctionName: string;
  utilityFunctionParams: any;
  columns: ColumnType[];
  dataSet: T[];
  idSet: IdSetConfig;
}

const dt = ref();
const index = ref(0);
const props = defineProps<ChildProps<any>>();  
const result = ref<number | null>(null);
const updateSearch = ref<string>('');
const internalDataSet = ref([...props.dataSet]);

function getSeverity(key: keyof IdSetConfig): string | undefined {
  const entry = props.idSet[key];
  return entry ? entry.severity : undefined;
}

function getLabel(key: keyof IdSetConfig): string | undefined {
  const entry = props.idSet[key];
  //return entry ? entry.label : undefined;
  return entry ? entry.severity : undefined;  
}

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

const searchFunction = async () => {
  if (updateSearch.value.length > 0) {
    await props.searchFunction(updateSearch.value);
    updateSearch.value = '';
  }
  else  
    await props.searchFunction('');
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const addNew = () => {
  props.addNew();
};

const buttonClick = (index: number) => {
  props.buttonClick(index);
};
/*
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

watch(
  () => props.dataSet,
  (newDataSet) => {
    internalDataSet.value = [...newDataSet];
  }
);
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
