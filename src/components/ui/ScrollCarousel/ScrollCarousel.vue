<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import axios from 'axios'

// Scroll Logic
const container = ref(null);
const speed = 0.5;
let isPaused = false;
let isDown = false;
let startX;
let scrollLeftStart;
let scrollAmount = 0;
let isHoverPaused = false;
let isClickPaused = false;
//
const emit = defineEmits(['category-click'])

// Funkcja obsługująca początek dotyku/kliknięcia
const startAction = (e) => {
  isDown = true;
  isPaused = true;
  // Obsługa Touch (e.touches[0]) lub Myszki (e.pageX)
  const pageX = e.pageX || e.touches[0].pageX;
  startX = pageX - container.value.offsetLeft;
  scrollLeftStart = container.value.scrollLeft;
};

// Funkcja kończąca
const stopAction = () => {
  isDown = false;
  isPaused = false;
  scrollAmount = container.value.scrollLeft; // synchronizacja po puszczeniu
};

// Logika przesuwania
const moveAction = (e) => {
  if (!isDown) return;

  // Zapobiega przesuwaniu całej strony podczas scrollowania paska na telefonie
  if (e.type === 'touchmove') e.preventDefault();

  const pageX = e.pageX || e.touches[0].pageX;
  const x = pageX - container.value.offsetLeft;
  const walk = (x - startX) * 1.5;

  scrollAmount = scrollLeftStart - walk;
  handleInfiniteScroll();
  container.value.scrollLeft = scrollAmount;
};

const categories = ref([]);

const duplicatedCategories = computed(() => [
  ...categories.value,
  ...categories.value,
  ...categories.value,
]);

function handleInfiniteScroll() {
  const el = container.value;
  const third = el.scrollWidth / 3;

  // scroll w prawo → reset do środka
  if (scrollAmount >= third * 2) {
    scrollAmount = third;
  }

  // scroll w lewo → reset do środka
  if (scrollAmount <= 0) {
    scrollAmount = third;
  }
}

async function fetchCategories() {
  await axios.get(`${import.meta.env.VITE_API_URL}`+'/api/carcategory')
    .then((response) => {
      categories.value = response.data
      console.log(categories.value);
    })
    .catch(e => console.log(e))
}

const handleClick = (category, e) => {
  isClickPaused = true;
  // Emitujemy zdarzenie o nazwie 'category-click' i przekazujemy dane kategorii
  emit('category-click', category, e);

};

const resumeScroll = () => {
  isClickPaused = false;
};

defineExpose({
  resumeScroll
});

onMounted(() => {
  fetchCategories();

  const el = container.value;


  // start od środka
  nextTick(() => {
    const third = el.scrollWidth / 3;
    el.scrollLeft = third;
    scrollAmount = third;
  });

  function animate() {
    if ((!isHoverPaused && !isDown) && !isClickPaused) {
      const isPaused = isHoverPaused || isClickPaused || isDown;

      if (!isPaused) {
        scrollAmount += speed;
        handleInfiniteScroll();
        el.scrollLeft = scrollAmount;
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
});


</script>

<template>
  <div
    ref="container"
    class="w-full overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
    @mousedown="startAction"
    @touchstart="startAction"
    @mouseup="stopAction"
    @touchend="stopAction"
    @mousemove="moveAction"
    @touchmove="moveAction"
    @mouseenter="isHoverPaused = true"
    @mouseleave="isHoverPaused = false"
  >
    <div class="flex gap-4 p-4 w-max">
      <!-- Twoje elementy (powtórzone dla pętli) -->
      <div v-for="category in duplicatedCategories" :key="category.id" class="flex-none w-64 h-32 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
        <div
          @click="(e) => handleClick(category, e)"
        >
          <div
            class="flex-none min-w-[250px] h-32 rounded-xl overflow-hidden snap-start cursor-pointer relative group shadow-sm"
          >
            <!-- Image -->
            <img
              :src="category.photo"
              :alt="name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <!-- Overlay gradient -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            ></div>

            <!-- Category name -->
            <div class="absolute bottom-2 left-3 text-white font-semibold text-sm">
              {{ category.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
