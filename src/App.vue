<template>
    <div><button @click="parentDirect">Click to have Parent call different utility function</button></div>
    <!-- Button label="Export CSV" @click="visible = true" /> -->
    <Dialog v-model:visible="visible" modal header="Download File">
        <div class="flex align-items-center gap-3 mb-5">
          <a :href="link" severity="secondary" @click="visible = false" target="_blank">{{ fileName }}</a>
          <div>Click X to close dialog.</div>
        </div>
    </Dialog>    
    <div>
        <ChildComponent :triggerParentFunction="triggerParentFunction"
                        :addNew="addNew"
                        :rowClick="handleRowClick"      
                        :buttonClick="handleButtonClick"                        
                        :anotherFunction="anotherParentFunction"
                        :searchFunction="searchFunction"
                        :dataObjectValues="dataObjectValues" 
                        :columns="columns" 
                        :dataSet="productsDataSet"
                        :idSet="productIdSet" 
                        :utilityFunctionName="utilityFunctionName" 
                        :utilityFunctionParams="utilityFunctionParams" />
    </div>
    <!---->
    <Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Product Details" :modal="true" class="p-fluid">
      <div class="field" v-if="product">
          <label for="name">Name</label>
          <InputText id="name" v-model.trim="product.name" required="true" autofocus :class="{'p-invalid': submitted && !product.name}" />
          <small class="p-error" v-if="submitted && !product.name">Name is required.</small>
      </div>
      <div class="field" v-if="product">
        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
          <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <Tag :value="slotProps.value.value" />
            </div>
            <div v-else-if="slotProps.value && !slotProps.value.value">
              <Tag :value="slotProps.value" />
            </div>
            <span v-else>
              {{slotProps.placeholder}}
            </span>
          </template>
        </Dropdown>
      </div>
      <div class="formgrid grid">
        <div class="field col"  v-if="product">
            <label for="quantity">Quantity</label>
            <InputNumber id="quantity" v-model="product.quantity" integeronly />
        </div>
      </div>
      <template #footer>
          <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"></Button>
          <Button label="Save" icon="pi pi-check" text @click="saveProduct"></Button>
      </template>
    </Dialog>
  <!---->    
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import dayjs from 'dayjs'
import { ProductService } from '@services/ProductService.ts';
import constants from '@helpers/constants.ts'
import ChildComponent from './ChildComponent.vue';
import dateHelper from '@helpers/date-helpers';

const toast = useToast();
const visible = ref(false);
const result = ref<number | null>(null);
const dataObjectValues = ref({ property1: 13, property2: 114 });
const param1 = ref<number>(0);
const param2 = ref<number>(0);
const link = ref('./src/hello.html')
const fileName = ref('Hello.html')
const product = ref<ProductType>();
const productDialog = ref(false);
const submitted = ref(false);
const statuses = ref([
  {label: 'success', value: 'success'},
  {label: 'info', value: 'info'},  
  {label: 'warning', value: 'warning'},
  {label: 'danger', value: 'danger'},
  {label: 'NEW', value: 'new'}
]);

const utilityFunctionName = ref('getDateStringFromTimestamp');
const utilityFunctionParams = ref<any>(null);
const productIdSet = ref(constants.productIdSet);
const products = ref<ProductType[]>([]);
const productsDataSet = ref<ProductType[]>([]);
const columns = ref<ColumnType[]>([
    { field: 'displayDate', header: 'Date', sortField: 'date', sortable: true }, //, exportable: true },
    { field: 'code', header: 'Code', severityField: 'inventoryStatus', sortable: true }, //, exportable: true },
    { field: 'name', header: 'Name', sortable: true }, //, exportable: true },
    { field: 'inventoryStatus', header: 'Status', labelField: 'inventoryStatus', sortable: true }, //, exportable: true },
    { field: 'quantity', header: 'Quantity', sortable: true }, //, exportable: true },
    { field: 'buttons', header: 'Action', sortable: false },  //, exportable: false },
]);

interface DTRowClickEvent {
	data: any;
	index: number;
}

interface DTRowButtonClickEvent extends DTRowClickEvent {
  buttonIndex: number;
}

interface DataObject {
  property1: number;
  property2: number;
}

interface ColumnType {
  field: string;
  header: string;
  sortable?: boolean;
  sortField?: string;
  severityField?: string;
  labelField?: string;
  //exportable?: boolean;  
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
    displayDate: string,
    buttons?: ButtonType[]
}

interface ButtonType {
  label: string;
  severity?: string;
  disabled?: boolean;
}

const initializeProduct = (product?: ProductType): ProductType => {
	if (!product) {
		product = {} as ProductType;
	}
  if (!product.buttons) {
    product.buttons = [] as ButtonType[]; 
  }
	product.id = '';
	product.code = '';
	product.name = '';
  product.description = '';
  product.image = '';
	product.price = 0;
	product.category = '';
	product.quantity = 0;
	product.inventoryStatus = '';  
  product.rating = 0;
	product.date = '';  
	product.displayDate = '';
  product.buttons = [] as ButtonType[]
	return product;
};

onMounted(async () => {
  let results = await ProductService.getProductsMini();
  results = results.map((row) => {
    // Modify buttons based on product's quantity
    row.buttons?.forEach(button => {
      button.disabled = (row.quantity === 0 && button.label === 'Edit') || button.disabled;
      return button;
    });
    return row;
  });   
  products.value = results;
  productsDataSet.value = results;
  utilityFunctionParams.value = dayjs();
  param1.value = 37;
  param2.value = 12;
});

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

const parentDirect = () => {
    const result = dateHelper.addDays(dateHelper.now(), 1);
    alert(`Parent direct call result: ${result}`);
}

const searchFunction = async (searchValue: string) => {
    //alert(`Parent received search value: ${searchValue}`)
    productsDataSet.value = products.value.filter((row) => row.name.includes(searchValue));
};

const addNew = () => {
  product.value = initializeProduct();
  submitted.value = false;
  productDialog.value = true;
};

const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};

const handleRowClick = (evt: DTRowClickEvent) => {
  alert(`Row ${evt.data.index+1} clicked`);
};

const handleButtonClick = (evt: DTRowClickEvent, buttonIndex: number) => {
  alert(`Button ${evt.data.buttons[buttonIndex].label} for Product ${evt.data.name} (${evt.data.code}) on row ${evt.index+1} clicked`);
};

const editProduct = () => {//(prod: ProductType) => {
  // product.value = {...prod};
  alert(`Here is the edit action for product product.value.name`);
  // productDialog.value = true;
};

const saveProduct = () => {
  submitted.value = true;
  if (!product || !product.value) return;

  if (product.value.name.trim()) {
    if (product.value.id) {
        //product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
        products.value[findIndexById(product.value.id)] = product.value;
        productsDataSet.value = products.value;
        //NOT SURE why the toast message doesn't seem to be doing anything        
        toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
    }
    else {
        product.value.id = createId();
        product.value.code = createId();
        product.value.inventoryStatus !== '' ? product.value.inventoryStatus : '-2';
        product.value.quantity = product.value.quantity ?? 0;
        //product.value.date = dayjs().format('YYYY-MM-DD');         
        product.value.displayDate = dayjs().format('M/D/YY');     
        products.value.push(product.value);
        productsDataSet.value = products.value;
        //NOT SURE why the toast message doesn't seem to be doing anything
        toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
        //should eventually save the new row back into the structure permanently
    }
    productDialog.value = false;
    //product.value = {}
    product.value = initializeProduct(); //TODO: Not sure if this is right, added for compilation
  }
};

const findIndexById = (id: string) => {
  let index = -1;
  for (let i = 0; i < products.value.length; i++) {
      if (products.value[i].id === id) {
          index = i;
          break;
      }
  }
  return index;
};

const createId = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 9; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}
</script>