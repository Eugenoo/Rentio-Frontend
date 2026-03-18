<script setup lang="ts">
import ScrollBarElement from '@/components/HomePage/Category/ScrollBarElement.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import InfiniteCarousel from '@/components/Carousel/InfiniteCarousel.vue'
import ScrollCarousel from '@/components/ui/ScrollCarousel/ScrollCarousel.vue'

const categories = ref([]);

onMounted(() => {
  fetchCategories();
})

const emit = defineEmits(['selectCategory'])

async function fetchCategories() {
  await axios.get(`${import.meta.env.VITE_API_URL}`+'/api/carcategory')
  .then((response) => {
    categories.value = response.data
  })
    .catch(e => console.log(e))
}

const carouselRef = ref(null)
const carouselRefTwo = ref(null)

function handleClick(item, e) {
  carouselRef.value?.pause()   // zatrzymaj animację
  emit("selectCategory", item, e)
}

function handleScrollCarouselClick(category, event)
{
  carouselRef.value?.pause()
  emit('selectCategory', category, event);
}

defineExpose({
  pauseCarousel() {
    carouselRef.value?.pause()
  },
  resumeCarousel() {
    carouselRef.value?.resume()
    carouselRefTwo.value?.resumeScroll()
  }
})

</script>

<template>
  <div class="overflow-x-auto mt-5 touch-pan-x">
    <div class="gap-4 snap-x snap-mandatory scroll-smooth">
      <scroll-carousel
        ref="carouselRefTwo"
        @category-click="(category, e) => handleScrollCarouselClick(category, e)"
      ></scroll-carousel>
    </div>
  </div>
</template>

<style scoped>

</style>
