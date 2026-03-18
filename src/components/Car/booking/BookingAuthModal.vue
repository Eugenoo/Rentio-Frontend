<template>
  <div class="fixed inset-0 z-70 flex items-center justify-center">
    <!-- overlay -->
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    ></div>

    <!-- modal -->
    <div class="relative z-80 bg-white p-6 rounded-xl w-full max-w-md">
      <div>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            Rent!
          </h2>
          <img src="/icons/close.png"
               @click="$emit('close')"
               class="h-5 cursor-pointer transition-transform duration-300 hover:rotate-90"
          />
        </div>
      </div>
      <div class="flex flex-col items-center gap-4 w-full">
        <button
          class="bg-blue-900 text-white px-6 py-2 rounded-full
         font-semibold
         transition-all duration-300
         hover:bg-blue-800
         hover:scale-105
         hover:shadow-lg
         active:scale-95"
          @click="$emit('login')"
        >
          LOG IN
        </button>        <button class="px-4 py-2 rounded-lg  text-black
         transition-all duration-300
         hover:bg-gray-200 hover:scale-105
         active:scale-95" @click="$emit('guest')">Rent as a Guest!</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
