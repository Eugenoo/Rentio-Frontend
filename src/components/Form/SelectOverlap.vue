<script setup>
import { useAttrs } from 'vue'

const model = defineModel()

defineProps({
  label: String,
  id: String,
  options: {
    type: Array,
    required: true
  },
  optionValue: {
    type: String,
    default: 'id'
  },
  optionLabel: {
    type: String,
    default: 'name'
  }
})

const attrs = useAttrs()
</script>

<template>
    <div class="relative w-full">
      <select
        v-model="model"
        :id="id"
        v-bind="attrs"
        class="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 text-sm bg-white
             focus:outline-none focus:border-blue-500"
      >
        <option value="" disabled hidden></option>

        <option
          v-for="option in options"
          :key="option[optionValue]"
          :value="option[optionValue]"
        >
          {{ option[optionLabel] }}
        </option>
      </select>

      <label
        :for="id"
        class="absolute left-3 transition-all pointer-events-none
             text-gray-500
             top-2 text-xs
             peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500
             peer-placeholder-shown:top-3.5
             peer-placeholder-shown:text-sm
             peer-placeholder-shown:text-gray-400"
      >
        {{ label }}
      </label>
    </div>
</template>
