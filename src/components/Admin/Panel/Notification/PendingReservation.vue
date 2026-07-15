<script setup lang="ts">

</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      @click="$emit('close')"
    >
      <div
        @click.stop
        class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm"
      >
        <router-link
          to="/admin/reservations"
          class="flex items-center flex-1"
          @click="$emit('close')"
        >
          <div class="inline-flex items-center justify-center w-8 h-8 text-orange-500 bg-orange-100 rounded-lg">
          </div>

          <div class="ms-3 text-sm font-normal">
            New Reservation
          </div>
        </router-link>

        <button
          @click="$emit('close')"
          class="ms-auto text-gray-400 hover:text-gray-900 p-1.5"
        >
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>


<style scoped>

</style>
