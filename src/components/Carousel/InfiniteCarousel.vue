<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  speed: { type: Number, default: 0.2 }
})

const track = ref(null)
let animationFrame = null
let position = 0

const duplicatedItems = computed(() => [
  ...props.items,
  ...props.items
])

function animate() {
  position -= props.speed

  if (track.value) {
    track.value.style.transform = `translateX(${position}px)`

    const width = track.value.scrollWidth / 2
    if (Math.abs(position) >= width) {
      position += width
    }
  }

  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  animationFrame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
})

function pause() {
  cancelAnimationFrame(animationFrame)
  animationFrame = null
}

function resume() {
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(animate)
  }
}

defineExpose({
  pause,
  resume
})
</script>
<template>
  <!-- Fade container -->
  <div class="relative overflow-hidden">

    <!-- Left fade -->
    <div class="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>

    <!-- Right fade -->
    <div class="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

    <!-- Carousel -->
    <div
      ref="track"
      class="flex gap-4 w-max"
    >
      <div
        v-for="(item, index) in duplicatedItems"
        :key="index"
        class="shrink-0"
      >
        <slot :item="item" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.img-box {
  width: 300px;          /* szerokość kontenera */
  height: 200px;         /* wysokość kontenera */
  overflow: hidden;      /* ukrywa to, co wyjdzie poza ramkę */
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;     /* ładne dopasowanie */
  transition: transform 0.4s ease; /* płynna animacja */
}

.img-box:hover img {
  transform: scale(1.1); /* przybliżenie */
}
</style>
