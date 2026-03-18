<script setup>
import ProductList from '@/components/Admin/Panel/Products/ProductList.vue'
import AddProductModal from '@/components/Admin/Panel/Products/AddProductModal.vue'
import { ref } from 'vue'

const addProduct = ref(null);

function showAddProductModal()
{
  addProduct.value = true;
}

function closeAddProductModal()
{
  addProduct.value = false;

}

const productListRef = ref(null);

function createProduct()
{
  productListRef.value?.fetchProducts()
  addProduct.value = false
}
</script>

<template>
  <div class="pl-8 mt-4 md:mt-16 p-5 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Vehicles</h1>
        <p class="text-gray-500 mt-1">Manage your vehicles</p>
      </div>
      <button @click="showAddProductModal" class="p-3 rounded-xl italic font-bold cursor-pointer bg-black text-white hover:bg-gradient-to-r hover:from-slate-900 hover:via-teal-700 hover:to-emerald-600
  transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"> ADD NEW VEHICLE</button>
    </div>
    <product-list ref="productListRef"></product-list>
    <router-view></router-view>
  </div>
  <add-product-modal
    v-if="addProduct"
    @close="closeAddProductModal"
    @create="createProduct"
  ></add-product-modal>
</template>

<style scoped>

</style>
