<script setup>
const model = defineModel()   //handle v-model

defineProps({
  label: String,
  id: String,
  type: {
    type: String,
    default: "text"
  }
})
</script>

<template>
  <div class="relative w-full mb-4">
    <input
      v-model="model"
      :type="type"
      :id="id"
      placeholder=" "
      class="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500"
    />

    <label
      :for="id"
      class="absolute left-3 top-2 text-gray-500 text-xs transition-all
      peer-placeholder-shown:top-3.5
      peer-placeholder-shown:text-sm
      peer-placeholder-shown:text-gray-400
      peer-focus:top-2
      peer-focus:text-xs
      peer-focus:text-blue-500"
    >
      {{ label }}
    </label>
  </div>
</template>
