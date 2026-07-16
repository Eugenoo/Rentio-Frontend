<!--<template>-->
<!--  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">-->
<!--    <table class="w-full text-sm text-left text-gray-500">-->
<!--      <thead class="text-xs text-gray-700 uppercase bg-gray-50">-->
<!--        <tr>-->
<!--          <th class="px-6 py-3">Name</th>-->
<!--          <th class="px-6 py-3">Description</th>-->
<!--          <th class="px-6 py-3">Photo</th>-->
<!--          <th class="px-6 py-3">Action</th>-->
<!--        </tr>-->
<!--      </thead>-->

<!--      <tbody>-->
<!--        <tr v-for="item in categories" :key="item.id" class="odd:bg-white even:bg-gray-50 border-b">-->
<!--          <td class="px-6 py-4 font-medium text-gray-900">-->
<!--            {{ item.name }}-->
<!--          </td>-->

<!--          <td class="px-6 py-4">-->
<!--            {{ item.description }}-->
<!--          </td>-->

<!--          <td class="px-6 py-4">-->
<!--            <img v-if="item.photo" :src="item.photo" class="h-10 w-10 object-cover rounded" />-->
<!--          </td>-->

<!--          <td class="px-6 py-4 flex gap-3">-->
<!--            <button @click="showEditModal(item)" class="text-blue-600 hover:underline">Edit</button>-->
<!--            <button @click="showDeleteModal(item)" class="text-red-600 hover:underline">Delete</button>-->
<!--          </td>-->
<!--        </tr>-->
<!--      </tbody>-->
<!--    </table>-->

<!--    &lt;!&ndash; EDIT &ndash;&gt;-->
<!--    <EditCategoryModal-->
<!--      v-if="editCategory"-->
<!--      :editCategory="editCategory"-->
<!--      @close="closeEditModal"-->
<!--      @update="fetchCategories"-->
<!--    />-->

<!--    &lt;!&ndash; DELETE &ndash;&gt;-->
<!--    <DeleteCategoryModal-->
<!--      v-if="deleteCategory"-->
<!--      :deleteCategory="deleteCategory"-->
<!--      @close="closeDeleteModal"-->
<!--      @delete="fetchCategories"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->
<template>
  <div class="relative overflow-x-auto bg-neutral-primary-soft shadow-sm rounded-2xl">

    <table class="w-full text-sm text-left text-gray-500">

      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th class="px-6 py-3">Name</th>
        <th class="px-6 py-3 hidden sm:table-cell">Description</th>
        <th class="px-6 py-3 hidden sm:table-cell">Photo</th>
        <th class="px-6 py-3">Action</th>
      </tr>
      </thead>

      <tbody>

      <template v-for="item in categories" :key="item.id">

        <!-- MAIN ROW -->
        <tr class="bg-white hover:bg-gray-100">

          <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {{ item.name }}
          </th>

          <td class="px-6 py-4 hidden sm:table-cell">
            {{ item.description }}
          </td>

          <td class="px-6 py-4 hidden sm:table-cell">
            <img
              v-if="item.photo"
              :src="item.photo"
              class="h-10 w-10 object-cover rounded-lg"
            />
          </td>

          <!-- ACTION DESKTOP -->
          <td class="px-6 py-4 hidden sm:table-cell space-x-2">

            <button
              @click="showEditModal(item)"
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

            <div class="space-y-3 text-sm">

              <p>
                <strong>Description:</strong>
                {{ item.description || '-' }}
              </p>

              <div v-if="item.photo">
                <strong>Photo:</strong>
                <div class="flex items-center justify-center">
                  <img
                    :src="item.photo"
                    class="mt-2 h-20 object-cover rounded-lg"
                  />
                </div>
              </div>

              <div class="flex gap-2 pt-2">

                <button
                  @click="showEditModal(item)"
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

    <!-- EDIT -->
    <EditCategoryModal
      v-if="editCategory"
      :editCategory="editCategory"
      @close="closeEditModal"
      @update="fetchCategories"
    />

    <!-- DELETE -->
    <DeleteCategoryModal
      v-if="deleteCategory"
      :deleteCategory="deleteCategory"
      @close="closeDeleteModal"
      @delete="fetchCategories"
    />

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import EditCategoryModal from '@/components/Admin/Panel/Categories/EditCategoryModal.vue'
import DeleteCategoryModal from '@/components/Admin/Panel/Categories/DeleteCategoryModal.vue'

const categories = ref([])
const editCategory = ref(null)
const deleteCategory = ref(null)

onMounted(() => {
  fetchCategories()
})

defineExpose({
  fetchCategories,
})

function fetchCategories() {
  axios
    .get(`${import.meta.env.VITE_API_URL}`+'/api/carcategory')
    .then((res) => {
      categories.value = res.data
    })
    .catch((err) => console.error(err))
}

function showEditModal(item) {
  editCategory.value = { ...item }
}

function showDeleteModal(item) {
  deleteCategory.value = { ...item }
}

function closeEditModal() {
  editCategory.value = null
}

function closeDeleteModal() {
  deleteCategory.value = null
}

//table accordion
const expandedRow = ref(null)

const toggleAccordion = (id) => {
  console.log(id)
  expandedRow.value = expandedRow.value === id ? null : id
}

</script>
