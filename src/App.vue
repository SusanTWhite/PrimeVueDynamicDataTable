
<template>
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
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import constants from '@helpers/constants.ts';
import { ProductService } from '@services/ProductService.ts';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';

onMounted(() => {
    //alert(`date: ${nowStr}`);
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const nowStr = dayjs().format();

const getSeverity = (inventoryStatus: keyof typeof constants.statusLabel.idSetEntry) => {
		return constants.statusLabel.idSetEntry[inventoryStatus].severity ?? null;
	};

const getLabel = (inventoryStatus: keyof typeof constants.statusLabel.idSetEntry) => {
    return constants.statusLabel.idSetEntry[inventoryStatus].label ?? '';
};

const products = ref();
const columns = [
    { field: 'displayDate', header: 'Date', sortField: 'date'},
    { field: 'code', header: 'Code', severityField: 'inventoryStatus'},
    { field: 'name', header: 'Name', },
    { field: 'inventoryStatus', header: 'Status', labelField: 'inventoryStatus'},
    { field: 'quantity', header: 'Quantity'}
];
</script>
