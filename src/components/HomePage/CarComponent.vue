<template>
    <div class="p-5 m-5 rounded-2xl bg-white cursor-pointer flex flex-col" @click="emit('select', car)">
      <p class="">
        {{ car.brand }}
      </p>
      <p class="font-bold text-6xl">
        {{ car.model }}
      </p>
      <div class="img-box">
        <img class="object-contain p-12" :src="car.photo" />
      </div>
      <div class="flex items-center justify-center mt-auto">
        <h1 class="font-bold">{{parseFloat(car.price_per_day)}} PLN / DAY</h1>
      </div>
    </div>
</template>

<script setup>
defineProps(['car'])
const emit = defineEmits(['select'])
</script>

<style scoped>
.img-box {
  /* wysokość kontenera */
  overflow: hidden; /* ukrywa to, co wyjdzie poza ramkę */
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* ładne dopasowanie */
  transition: transform 0.4s ease; /* płynna animacja */
}

.img-box:hover img {
  transform: scale(1.1); /* przybliżenie */
}
</style>
