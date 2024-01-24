<template>
    <div><button @click="parentDirect">Click to have Parent call different utility function</button></div>
    <div>
        <ChildComponent :customFunction="parentFunction" 
                        :columns="columns" 
                        :dataSet="products" 
                        :idSet="productIdSet" 
                        :utilityFunctionName="utilityFunctionName" 
                        :utilityFunctionParams="utilityFunctionParams" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs'
import { ProductService } from '@services/ProductService.ts';
import constants from '@helpers/constants.ts'
import ChildComponent from './ChildComponent.vue';
import dateHelper from '@helpers/date-helpers';

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
    utilityFunctionParams.value = dayjs();
});

const parentDirect = () => {
    const result = dateHelper.addDays(dateHelper.now(), 1);
    alert(`Parent direct call result: ${result}`);
}

const utilityFunctionName = ref('getDateStringFromTimestamp');
const utilityFunctionParams = ref<any>(null);
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