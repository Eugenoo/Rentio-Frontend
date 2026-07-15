<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  }
})
</script>

<template>
  <div
    class="flex-none min-w-[250px] h-32 rounded-xl overflow-hidden snap-start cursor-pointer relative group shadow-sm"
  >
    <!-- Image -->
    <img
      :src="image"
      :alt="name"
      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    <!-- Overlay gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
    ></div>

    <!-- Category name -->
    <div class="absolute bottom-2 left-3 text-white font-semibold text-sm">
      {{ name }}
    </div>
  </div>
</template>
