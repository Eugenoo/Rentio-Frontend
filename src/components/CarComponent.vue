<template>
  <router-link :to="`/details/${car.slug}`">
    <div class="p-6 relative h-1/3">
      <p class="">
        {{ car.brand }}
      </p>
      <p class="font-bold text-6xl">
        {{ car.model }}
      </p>
      <div>
        <img class="-right-30 mt-10 absolute top-0 object-cover p-12" :src="car.photo" />
      </div>
    </div>
  </router-link>

</template>

<script setup>
defineProps(['car'])
</script>

<style scoped></style>
