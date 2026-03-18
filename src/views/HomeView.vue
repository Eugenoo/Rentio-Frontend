<template>
  <main>
    <div class="bg-[#f8f8f8]">
      <NavBar />
      <div class="relative h-[500px] rounded-2xl overflow-hidden">

        <img
          src="/img/background.jpg"
          alt="background"
          class="absolute inset-0 w-full h-full object-cover"
        />

        <div class="absolute inset-0 bg-black/50"></div>

        <div class="absolute inset-0 flex items-center justify-center">
          <h1 class="text-white text-4xl md:text-6xl font-bold text-center">
            Book. Drive. Go.
          </h1>
        </div>
      </div>
      <CategorySection
        ref="categorySectionRef"
        @selectCategory="openCategory"
      />
      <ExpandTransition ref="expandRef"
      >
        <template #content="{ close }">
          <div class="flex flex-col h-full">
            <!-- scrollowalny content -->
            <div class="flex-1 overflow-y-auto h-full">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                <CarComponent
                  v-for="car in filteredCars"
                  :key="car.id"
                  :car="car"
                  @select="(car) => goToCarFromModal(car, close)"
                />
              </div>
            </div>
            <!-- footer -->
            <div class="p-6 flex justify-center">
              <button
                class="px-5 py-2 bg-black text-white rounded-lg"
                @click="() => { close(); onModalClose(); }"
              >
                Close
              </button>
            </div>
          </div>
        </template>
      </ExpandTransition>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <CarComponent
          v-for="car in cars"
          :key="car.id"
          :car="car"
          @select="goToCar"
        />
      </div>
    </div>
  </main>
</template>
<script setup>

import CarComponent from "@/components/HomePage/CarComponent.vue";
import { onMounted, computed, ref } from 'vue'
import axios from 'axios'
import NavBar from '@/components/Navigation/NavBar.vue'
import CategorySection from '@/components/HomePage/Category/CategorySection.vue'
import ExpandTransition from '@/components/ui/ExpandTransition.vue'
import router from '@/router/index.js'

const cars = ref([]);

onMounted(async() => {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + '/api/car')
    cars.value = res.data
  } catch (error) {
    console.log(error)
  }
})

const activeCategory = ref(null)
const categorySectionRef = ref(null)
const categorySectionRefTwo = ref(null)

const expandRef = ref()

function openCategory(category, event) {
  activeCategory.value = category
  categorySectionRef.value?.pauseCarousel?.()
  expandRef.value.open(event.currentTarget)
}

function goToCar(car) {
  router.push(`/details/${car.slug}`)
}

async function goToCarFromModal(car, close) {
  await close(true)
  router.push(`/details/${car.slug}`)
}

function onModalClose() {
  setTimeout(() => {
    categorySectionRef.value?.resumeCarousel?.()
  }, 1200) // czas trwania transition
}

const filteredCars = computed(() => {
  if (!activeCategory.value || !cars.value) return []

  return cars.value.filter(
    car => car.car_category_id === activeCategory.value.id
  )
})

</script>

<style>

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
