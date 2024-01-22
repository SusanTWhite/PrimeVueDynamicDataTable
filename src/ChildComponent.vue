<template>
  <div>
    <button @click="runCustomFunction">Run Function from Parent</button>
  </div>
  <div class="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column v-for="col of columns" :key="col.field" :field="col.field" :sortField="col.sortField??col.field" :header="col.header" :severityField="col.severityField??null" :labelField="col.labelField??null">
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
import { ref } from 'vue';
import dayjs from 'dayjs';
import constants from '@helpers/constants.ts';
import { ProductService } from '@services/ProductService.ts';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

type LabelSet = {
	severity: string;
	label: string;
  };
 
type IdSetEntryConfig = Record<string, LabelSet>;  

interface ChildProps {
  customFunction: () => void,
  columns: ColumnType[];
  products: ProductType[]; 
}

interface ProductType {
    id: string,
    code: string,
    name: string,
    description: string,
    image: string,
    price: number,
    category: string,
    quantity: number
    inventoryStatus: string,
    rating: number,
    date: string,
    displayDate: string
}

interface ColumnType { 
    field: string,
    header: string,
    sortField?: string,
    severityField?: string,
    labelField?: string
}

function getSeverity(key: keyof IdSetEntryConfig): string | undefined {
  const entry = constants.idSetEntry[key];
  return entry ? entry.severity : undefined;
}

function getSeverityFromField(columns: Column[], field: keyof Column, value: string): string | null {
  const column = columns.find((col) => 'field' in col && col.field === field && 'severityField' in col && col.severityField !== undefined);

  if (column && 'severityField' in column) {
    const severity = getSeverity(value);
    return severity !== undefined ? severity : null;
  }

  return null
}

function getLabel(key: keyof IdSetEntryConfig): string | undefined {
  const entry = constants.idSetEntry[key];
  return entry ? entry.severity : undefined;
}

function getLabelFromField(columns: Column[], field: keyof Column, value: string): string | null {
  const column = columns.find((col) => 'field' in col && col.field === field && 'labelField' in col && col.labelField !== undefined);

  if (column && 'labelField' in column) {
    const label = getLabel(value);
    return label !== undefined ? label : null;
  }

  return null
}

const props = defineProps<ChildProps>();

const nowStr = dayjs().format();

const runCustomFunction = () => {
  props.customFunction();
};
</script>
