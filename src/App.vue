<template>
    <div>
        <ChildComponent :customFunction="parentFunction" :columns="columns" :dataSet="products" :idSet="productIdSet" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ProductService } from '@services/ProductService.ts';
import constants from '@helpers/constants.ts'
import ChildComponent from './ChildComponent.vue';

const parentFunction = () => {
  // Parent function logic
  alert('You just executed a parent component function from a child component!');
};

interface ColumnType {
  field: string;
  header: string;
  sortField?: string;
  severityField?: string;
  labelField?: string;
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

onMounted(() => {
    ProductService.getProductsMini().then((data) => (products.value = data));
});

const productIdSet = ref(constants.productIdSet);
const products = ref<ProductType[]>([]);
const columns = ref<ColumnType[]>([
    { field: 'displayDate', header: 'Date', sortField: 'date'},
    { field: 'code', header: 'Code', severityField: 'inventoryStatus'},
    { field: 'name', header: 'Name', },
    { field: 'inventoryStatus', header: 'Status', labelField: 'inventoryStatus'},
    { field: 'quantity', header: 'Quantity'}
]);
</script>
