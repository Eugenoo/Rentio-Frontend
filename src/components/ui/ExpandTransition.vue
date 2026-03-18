<script setup lang="ts">
import { ref, nextTick } from "vue"

const isOpen = ref(false)
const overlay = ref<HTMLElement | null>(null)
const clone = ref<HTMLElement | null>(null)
const showContent = ref(false)

let firstRect: DOMRect | null = null
let sourceEl: HTMLElement | null = null

function open(el: HTMLElement) {
  sourceEl = el
  firstRect = el.getBoundingClientRect()

  showContent.value = false

  clone.value = el.cloneNode(true) as HTMLElement
  clone.value.style.position = "fixed"
  clone.value.style.margin = "0"
  clone.value.style.top = firstRect.top + "px"
  clone.value.style.left = firstRect.left + "px"
  clone.value.style.width = firstRect.width + "px"
  clone.value.style.height = firstRect.height + "px"
  clone.value.style.zIndex = "100"

  document.body.appendChild(clone.value)

  isOpen.value = true
  document.body.classList.add("overflow-hidden")

  nextTick(() => animateOpen())
}
function close(skipImageAnimation = false) {
  return new Promise<void>((resolve) => {

    showContent.value = false

    if (skipImageAnimation) {
      const target = overlay.value?.querySelector(".target") as HTMLElement | null
      if (target) {
        target.style.opacity = "0"
      }

      clone.value?.remove()
      isOpen.value = false
      document.body.classList.remove("overflow-hidden")
      resolve()
      return
    }

    setTimeout(() => {
      if (!clone.value || !overlay.value || !firstRect) {
        resolve()
        return
      }

      const target = overlay.value.querySelector(".target") as HTMLElement
      const lastRect = target.getBoundingClientRect()

      const animation = clone.value.animate(
        [
          {
            top: lastRect.top + "px",
            left: lastRect.left + "px",
            width: lastRect.width + "px",
            height: lastRect.height + "px"
          },
          {
            top: firstRect.top + "px",
            left: firstRect.left + "px",
            width: firstRect.width + "px",
            height: firstRect.height + "px"
          }
        ],
        {
          duration: 450,
          easing: "cubic-bezier(.2,.8,.2,1)"
        }
      )

      animation.onfinish = () => {
        clone.value?.remove()
        isOpen.value = false
        document.body.classList.remove("overflow-hidden")
        resolve()
      }

    }, 450)

  })
}
// function close(skipImageAnimation = false) {
//
//   if (skipImageAnimation) {
//     clone.value?.remove()
//     isOpen.value = false
//     document.body.classList.remove("overflow-hidden")
//     return
//   }
//   // chowamy panel
//   showContent.value = false
//
//   // czekamy aż animacja panelu się skończy
//   setTimeout(() => {
//     if (!clone.value || !overlay.value || !firstRect) return
//
//     const target = overlay.value.querySelector(".target") as HTMLElement
//     console.log(target);
//     const lastRect = target.getBoundingClientRect()
//
//     const animation = clone.value.animate(
//       [
//         {
//           top: lastRect.top + "px",
//           left: lastRect.left + "px",
//           width: lastRect.width + "px",
//           height: lastRect.height + "px"
//         },
//         {
//           top: firstRect.top + "px",
//           left: firstRect.left + "px",
//           width: firstRect.width + "px",
//           height: firstRect.height + "px"
//         }
//       ],
//       {
//         duration: 450,
//         easing: "cubic-bezier(.2,.8,.2,1)"
//       }
//     )
//
//     animation.onfinish = () => {
//       clone.value?.remove()
//       isOpen.value = false
//       document.body.classList.remove("overflow-hidden")
//     }
//   }, 450) // musi być podobne do czasu animacji panelu
// }
defineExpose({ open, close })

function animateOpen() {
  if (!clone.value || !overlay.value) return

  const target = overlay.value.querySelector(".target") as HTMLElement
  const lastRect = target.getBoundingClientRect()

  const animation = clone.value.animate(
    [
      {
        top: firstRect!.top + "px",
        left: firstRect!.left + "px",
        width: firstRect!.width + "px",
        height: firstRect!.height + "px"
      },
      {
        top: lastRect.top + "px",
        left: lastRect.left + "px",
        width: lastRect.width + "px",
        height: lastRect.height + "px"
      }
    ],
    {
      duration: 450,
      easing: "cubic-bezier(.2,.8,.2,1)",
      fill: "forwards"
    }
  )

  animation.onfinish = () => {
    setTimeout(() => {
      showContent.value = true
    }, 120)
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    ref="overlay"
    class="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-start justify-center p-10 overflow-y-auto"
  >
    <div class="rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
      <!-- target element -->
      <div class="target" >
        <slot name="image" :closeImg="() => close(true)"/>
      </div>
      <!-- wysuwany panel -->
      <transition name="panel-slide" class="h-screen">
        <div
          v-if="showContent"
          class="bg-white mt-20 p-5 border-t border-gray-100 overflow-y-auto"
        >
          <slot name="content" :close="close" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.panel-slide-enter-active {
  transition: transform 900ms cubic-bezier(.22,1,.36,1),
  opacity 700ms ease;
}

.panel-slide-enter-from {
  transform: translateY(-60px);
  opacity: 0;
}

.panel-slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.panel-slide-leave-active {
  transition: transform 450ms cubic-bezier(.22,1,.36,1),
  opacity 350ms ease;
}

.panel-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.panel-slide-leave-to {
  transform: translateY(-60px);
  opacity: 0;
}
</style>
