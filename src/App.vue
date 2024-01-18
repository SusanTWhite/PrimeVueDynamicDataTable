
<template>
    <div class="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column v-for="col of columns" :key="col.field" :field="col.field" :sortField="col.sortField ?? col.field" :header="col.header"></Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
//const dayjs = require('dayjs');
import { ref, onMounted } from 'vue';
import constants from '@helpers/constants.ts';
import { ProductService } from '@services/ProductService.ts';

onMounted(() => {
    //alert(`date: ${nowStr}`);
    ProductService.getProductsMini().then((data) => (products.value = data));
});

//const now = Date.prototype.toISOString();
//const nowStr = dayjs().format('DD/MM/YYYY');
const getStatusSeverity = (licenseStatus: keyof typeof constants.statusLabel.idSetEntry) => {
		return constants.statusLabel.idSetEntry[licenseStatus].severity;
	};

	const getStatusText = (licenseStatus: keyof typeof constants.statusLabel.idSetEntry) => {
		return constants.statusLabel.idSetEntry[licenseStatus].label;
	};
const products = ref();
const columns = [
    { field: 'displayDate', header: 'Date', sortField: 'date'},
    { field: 'code', header: 'Code'},
    { field: 'name', header: 'Name'},
    { field: 'category', header: 'Category' },
    { field: 'quantity', header: 'Quantity' }
];

</script>
