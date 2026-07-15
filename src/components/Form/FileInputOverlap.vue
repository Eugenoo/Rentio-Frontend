<script setup>
import { ref } from 'vue'

const model = defineModel()

defineProps({
  label: String,
  id: String
})

const preview = ref(null)

function handleChange(event) {
  const file = event.target.files[0]
  if (!file) return

  model.value = file
  preview.value = URL.createObjectURL(file)
}
</script>

<template>
  <div class="relative w-full mb-4">
    <input
      type="file"
      :id="id"
      accept="image/*"
      class="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm
             focus:outline-none focus:border-blue-500"
      @change="handleChange"
    />

    <label
      :for="id"
      class="absolute left-3 top-2 text-gray-500 text-xs transition-all
             peer-focus:top-2
             peer-focus:text-xs
             peer-focus:text-blue-500"
    >
      {{ label }}
    </label>

    <!-- Preview -->
    <div class="flex justify-center">
      <img
        v-if="preview"
        :src="preview"
        class="h-32 mt-3 object-cover rounded"
      />
    </div>

  </div>
</template>
