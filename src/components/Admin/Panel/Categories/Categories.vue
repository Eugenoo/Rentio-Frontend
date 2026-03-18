<script setup>
import CategoryList from '@/components/Admin/Panel/Categories/CategoryList.vue'
import AddCategoryModal from '@/components/Admin/Panel/Categories/AddCategoryModal.vue'
import { ref } from 'vue'

const addCategory = ref(false)
const categoryListRef = ref(null)

function showAddCategoryModal() {
  addCategory.value = true
}

function closeAddCategoryModal() {
  addCategory.value = false
}

function createCategory() {
  categoryListRef.value?.fetchCategories()
  addCategory.value = false
}
</script>

<template>
  <div class="pl-8 mt-4 md:mt-16 p-5 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Categories</h1>
        <p class="text-gray-500 mt-1">Manage Categories</p>
      </div>
      <button @click="showAddCategoryModal" class="p-3 rounded-xl italic font-bold cursor-pointer bg-black text-white hover:bg-gradient-to-r hover:from-slate-900 hover:via-yellow-700 hover:to-orange-600
  transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"> ADD NEW CATEGORY</button>
    </div>
    <br />
    <CategoryList ref="categoryListRef" />
    <router-view />
  </div>
  <AddCategoryModal
    v-if="addCategory"
    @close="closeAddCategoryModal"
    @create="createCategory"
  />
</template>
