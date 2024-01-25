<template>
    <div><button @click="parentDirect">Click to have Parent call different utility function</button></div>
    <div>
        <ChildComponent :triggerParentFunction="triggerParentFunction"
                        :customFunction="parentFunction" 
                        :anotherFunction="anotherParentFunction"
                        :dataObjectValues="dataObjectValues" 
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

const result = ref<number | null>(null);
const dataObjectValues = ref({ property1: 13, property2: 114 });
const param1 = ref<number>(0);
const param2 = ref<number>(0);

const parentFunction = () => {
  // Parent function logic
  alert('You just executed a parent component function from a child component!');
};

const anotherParentFunction = (data: any) => {
  // Custom logic to process the object structure
  // For example, summing the values of some properties
  return data.property1 + data.property2;
};

const yetAnotherFunction = (property1: number, property2: number) => {
  //keeping all the data in the parent and only returning the outcome to the child as needed for use
  return property1 + property2;
};

// Function triggered by ChildComponent
const triggerParentFunction = () => {
  // Parameters defined in the parent
  const property1 = param1.value;
  const property2 = param2.value;

  // Call another function with parameters and set the result
  return result.value = yetAnotherFunction(property1, property2);
};

interface DataObject {
  property1: number;
  property2: number;
}

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
    param1.value = 37;
    param2.value = 12;
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