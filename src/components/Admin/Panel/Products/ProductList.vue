<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import EditProductModal from '@/components/Admin/Panel/Products/EditProductModal.vue'
import DeleteModal from '@/components/Admin/Panel/Products/DeleteModal.vue'

const products = ref()
const editProduct = ref(null);
const deleteProduct = ref(null);

onMounted(async () => {
  fetchProducts();
})

defineExpose({
  fetchProducts
})

function closeProductModal()
{
  editProduct.value = null;
}

function closeDeleteModal()
{
  deleteProduct.value = null;
}

function fetchProducts()
{
   axios.get(`${import.meta.env.VITE_API_URL}`+'/api/car')
     .then(res => {
       products.value = res.data;
     })
     .catch(err => {
       console.log(err);
     })
}

function showProductModal(item)
{
  editProduct.value = { ...item};
}

function showDeleteModal(item)
{
  deleteProduct.value = { ...item };
}

//table accordion
const expandedRow = ref(null)

const toggleAccordion = (id) => {
  expandedRow.value = expandedRow.value === id ? null : id
}

</script>

<template>
  <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-sm rounded-2xl">
    <table class="w-full text-sm text-left text-gray-500">

      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th class="px-6 py-3">Brand</th>
        <th class="px-6 py-3">Model</th>
        <th class="px-6 py-3 hidden sm:table-cell">Year</th>
        <th class="px-6 py-3 hidden sm:table-cell">Category</th>
        <th class="px-6 py-3 hidden sm:table-cell">Price</th>
        <th class="px-6 py-3 hidden sm:table-cell">Availability</th>
        <th class="px-6 py-3">Action</th>
      </tr>
      </thead>

      <tbody>

      <template v-for="item in products" :key="item.id">

        <!-- MAIN ROW -->
        <tr class="bg-white hover:bg-gray-100">

          <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {{ item.brand }}
          </th>

          <td class="px-6 py-4">
            {{ item.model }}
          </td>

          <td class="px-6 py-4 hidden sm:table-cell">
            {{ item.year }}
          </td>

          <td class="px-6 py-4 hidden sm:table-cell">
            {{ item.category.name }}
          </td>

          <td class="px-6 py-4 hidden sm:table-cell">
            {{ item.price_per_day }} $
          </td>

          <td class="px-6 py-4 hidden sm:table-cell">
          <span
            :class="item.available
            ? 'text-green-600 font-medium'
            : 'text-red-600 font-medium'"
          >
            {{ item.available ? '✔ Available' : '✖ Not available' }}
          </span>
          </td>

          <!-- ACTION DESKTOP -->
          <td class="px-6 py-4 hidden sm:table-cell space-x-2">

            <button
              @click="showProductModal(item)"
              class="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            >
              Edit
            </button>

            <button
              @click="showDeleteModal(item)"
              class="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
            >
              Delete
            </button>

          </td>

          <!-- MOBILE ARROW -->
          <td class="px-6 py-4 sm:hidden flex justify-center">
            <button @click="toggleAccordion(item.id)">
              <svg
                class="size-6 transition-transform duration-300"
                :class="{ 'rotate-180': expandedRow === item.id }"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
              </svg>
            </button>
          </td>

        </tr>

        <!-- MOBILE EXPANDED -->
        <tr v-if="expandedRow === item.id" class="bg-white sm:hidden">
          <td colspan="100%" class="p-4">

            <div class="space-y-2 text-sm">

              <p><strong>Year:</strong> {{ item.year }}</p>

              <p><strong>Category:</strong> {{ item.category?.name}}</p>

              <p><strong>Price:</strong> {{ item.price_per_day }} $ / day</p>

              <p>
                <strong>Availability:</strong>
                <span
                  :class="item.available
                ? 'text-green-600'
                : 'text-red-600'"
                >
                {{ item.available ? 'Available' : 'Not available' }}
              </span>
              </p>

              <div class="flex gap-2 pt-2">

                <button
                  @click="showProductModal(item)"
                  class="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                >
                  Edit
                </button>

                <button
                  @click="showDeleteModal(item)"
                  class="px-3 py-1 rounded-lg bg-red-600 text-white text-sm"
                >
                  Delete
                </button>

              </div>

            </div>

          </td>
        </tr>

      </template>

      </tbody>
    </table>

    <edit-product-modal
      v-if="editProduct"
      :editProduct="editProduct"
      @close="closeProductModal"
      @update="fetchProducts"
    ></edit-product-modal>

    <delete-modal
      v-if="deleteProduct"
      :deleteProduct="deleteProduct"
      @close="closeDeleteModal"
      @delete="fetchProducts"
    ></delete-modal>

  </div>
</template>

<style scoped></style>
