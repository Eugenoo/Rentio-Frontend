<template>
  <section class="relative py-8 md:py-16  sm:p-8">
<!--CALENDAR-->
    <div class="max-w-7xl mx-auto px-4 lg:px-8 xl:px-14">
      <div class="flex items-center justify-between gap-3 md:mb-5">
        <div class="flex items-center gap-4">
          <h5 class="text-xl leading-8 font-semibold text-gray-900">{{ monthAndDay }}</h5>
          <div class="flex items-center gap-2">
            <button
              @click="prevMonth(monthAndDay)"
              class="text-gray-500 rounded transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M10.0002 11.9999L6 7.99971L10.0025 3.99719"
                  stroke="currentcolor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <button
              @click="nextMonth(monthAndDay)"
              class="text-gray-500 rounded transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6.00236 3.99707L10.0025 7.99723L6 11.9998"
                  stroke="currentcolor"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!--Calendar Grid Start-->

      <div class="border border-gray-200">
        <div class="grid grid-cols-7 divide-gray-200 border-b border-gray-200">
          <div
            v-for="day in weekDays"
            :key="day"
            class="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200"
          >
            <span class="text-sm font-medium text-gray-500">{{ day }}</span>
          </div>
        </div>

        <div class="grid grid-cols-7 divide-gray-200">
          <div
            v-for="(day, index) in calendarDays"
            @click="selectDate(day)"
            :key="index"
            class="p-3.5 xl:aspect-auto border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[30px] md:min-h-[70px] transition-all duration-300 hover:bg-gray-100"
            :class="{
              'bg-gray-50 hover:bg-gray-150': !day.isCurrentMonth,
              'bg-red-200 hover:bg-red-300': day.isReserved,
              'bg-green-300 hover:bg-green-400': isDateSelected(day.date),
              'opacity-40 cursor-not-allowed pointer-events-none': day.isPast,
            }"
          >
            <span
              class="text-xs font-semibold flex items-center justify-center w-7 h-7 rounded-full"
              :class="{
                'text-gray-500': !day.isCurrentMonth,
                'text-white bg-indigo-600': day.isToday,
                'text-gray-900': day.isCurrentMonth && !day.isToday,
                'lg:hidden w-2 h-2 rounded-full bg-gray-400': day.reserved,
              }"
              >{{ day.day }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-4 w-full p-5">
      <transition name="fade-pop" appear>
        <div v-if="reservation.endDate" class="flex flex-col items-center gap-2">
          <div>
            <span class="font-bold text-xl">DAILY: </span>
            <span class="font-bold text-xl">{{parseFloat(reservation.dailyPrice)}}  PLN   </span>
          </div>
          <div>
            <span class="font-bold text-2xl">TOTAL: {{ parseFloat(reservation.totalPrice) }} PLN</span>
          </div>
          <button class="gradient-border text-xl italic" @click="showBookingAuthModal()">RENT!</button>
        </div>
      </transition>

      <booking-auth-modal
        v-if="showBookingAuth"
        @close="closeBookingAuthModal"
        @login="showBookingLoginFormModal"
        @guest="showBookingGuestFormModal"
      ></booking-auth-modal>
      <booking-login-form
        v-if="showBookingLoginForm"
        @close="closeBookingLoginFormModal"
        @showConfirmation="showSummaryModal"
      ></booking-login-form>
      <booking-guest-form
        v-if="showBookingGuestForm"
        @close="closeBookingGuestFormModal"
        @showConfirmation="showSummaryModal"
      ></booking-guest-form>
      <booking-summary
        v-if="showBookingSummaryModal"
        @close="closeSummaryModal"
        @rentUser="openPayment"
      >
      </booking-summary>
    </div>
  </section>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useReservationStore } from '@/stores/reservation.js'
import BookingAuthModal from '@/components/Car/booking/BookingAuthModal.vue'
import BookingLoginForm from '@/components/Car/booking/BookingLoginForm.vue'
import BookingGuestForm from '@/components/Car/booking/BookingGuestForm.vue'
import BookingSummary from '@/components/Car/booking/BookingSummary.vue'
import { useAuthStore } from '@/stores/auth.js'
import { usePaymentStore } from '@/stores/payment.js'

const monthAndDay = ref()
const currentDay = ref()
const daysOfMonth = ref()
const firstDayOfMonth = ref()
const daysInPrevMonth = ref()
const reserved = ref(false)
const currentYear = ref(null)
const currentMonth = ref(null)
const displayedMonth = ref()
const displayedYear = ref()
const selectedStart = ref(null)
const selectedEnd = ref(null)
const isCalendarReady = ref(false)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const firstDayIndex = ref(0)

const reservation = useReservationStore();
const paymentStore = usePaymentStore();

//MODAL HANDLING

const showBookingAuth = ref(false)
const showBookingLoginForm = ref(false)
const showBookingGuestForm = ref(false)
const showBookingSummaryModal = ref(false)

function showSummaryModal() {
  showBookingGuestForm.value = false
  showBookingLoginForm.value = false
  showBookingSummaryModal.value = true
}

function closeSummaryModal() {
  showBookingSummaryModal.value = false
  showBookingGuestForm.value = false
  showBookingLoginForm.value = false
  showBookingAuth.value = false
}

function showBookingAuthModal() {
  const auth = useAuthStore();

  if (auth.isAuthenticated) {
    showBookingSummaryModal.value = true
  }
  showBookingAuth.value = true
}

function showBookingLoginFormModal() {
  showBookingLoginForm.value = true
}

function showBookingGuestFormModal() {
  showBookingGuestForm.value = true
}

function closeBookingAuthModal() {
  showBookingAuth.value = false
}

function closeBookingLoginFormModal()
{
  showBookingLoginForm.value = false
}

function closeBookingGuestFormModal() {
  showBookingGuestForm.value = false
}
//daily price

const props = defineProps({
  dailyPrice: {
    type: Number,
    required: true,
  }
});

reservation.dailyPrice = props.dailyPrice;

//Helper Function
function getDatesBetween(start, end) {
  const days = []
  const firstDate = new Date(start)
  const secondDate = new Date(end)

  while (firstDate <= secondDate) {
    days.push(firstDate.toISOString().split('T')[0])
    firstDate.setDate(firstDate.getDate() + 1)
  }
  return days
}

const isDateSelected = (dateStr) => {
  if (!selectedStart.value || !selectedEnd.value) return false
  const date = new Date(dateStr)
  const start = new Date(selectedStart.value)
  const end = new Date(selectedEnd.value)
  return date >= start && date <= end
}

const selectDate = (day) => {
  if (!day.isCurrentMonth) return //date of next and prev month is undefined
  if (!isCalendarReady.value) return
  if (day.isPast) return
  //clicked date handler
  const clickedDateString = day.day + ' ' + monthAndDay.value
  const date = new Date(clickedDateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const clickedDay = String(date.getDate()).padStart(2, '0')
  const clickedDate = `${year}-${month}-${clickedDay}`

  if (!selectedStart.value || (selectedStart.value && selectedEnd.value)) {
    selectedStart.value = clickedDate
    selectedEnd.value = null
  } else if (selectedStart.value && !selectedEnd.value) {
    const start = new Date(selectedStart.value)
    const end = new Date(clickedDate)
    if (end >= start) {
      selectedEnd.value = clickedDate
    } else {
      selectedEnd.value = selectedStart.value
      selectedStart.value = clickedDate
    }
    //calc days and price
      //strict value just for test, need to be changed with normal daily price which can be binded from mother component
    reservation.startDate = selectedStart.value
    reservation.endDate = selectedEnd.value
    //if selected date between has reservation show alert
    const dates = getDatesBetween(selectedStart.value, selectedEnd.value)
    if (haveSameValues(dates, reserved.value)) {
      alert('The date you select is taken, try different one :)')
      selectedStart.value = null
      selectedEnd.value = null
    }
  }
}

const fetchCalendarData = async () => {
  try {
    const route = useRoute()
    const carName = route.params.carName
    const carRes = await axios.get(`${import.meta.env.VITE_API_URL}`+`/api/car/${carName}`)
    const carId = carRes.data.id

    const [calendarRes, reservationRes] = await Promise.all([
      //get callendar info
      axios.get(`${import.meta.env.VITE_API_URL}`+'/api/callendar'),
      axios.get(`${import.meta.env.VITE_API_URL}`+`/api/car/${carId}/reservations`), // second endpoint
    ])

    monthAndDay.value = calendarRes.data.monthAndDay
    currentMonth.value = calendarRes.data.currentMonth
    currentYear.value = calendarRes.data.currentYear
    currentDay.value = parseInt(calendarRes.data.currentDay)
    daysOfMonth.value = calendarRes.data.daysOfTheMonth
    firstDayOfMonth.value = calendarRes.data.firstDayOfMonth
    daysInPrevMonth.value = calendarRes.data.daysInPrevMonth
    firstDayIndex.value = weekDays.findIndex((d) => d === firstDayOfMonth.value)
    displayedMonth.value = currentMonth.value
    displayedYear.value = currentYear.value

    // reserved day handler
    let reservedDays = []

    reservationRes.data.forEach((res) => {
      if(res.status === 'cancelled'){
        return
      }
      const days = getDatesBetween(res.start_date, res.end_date)
      reservedDays = reservedDays.concat(days)
    })

    // Remove duplicates
    reservedDays = [...new Set(reservedDays)]
    reserved.value = reservedDays
    isCalendarReady.value = true
  } catch (error) {
    console.error('Failed to fetch calendar data:', error)
  }
}

onMounted(() => {
  fetchCalendarData()
  reservation.clearDates()
})

//Create computed calendarDays
const calendarDays = computed(() => {
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Previous month's trailing days
  for (let i = firstDayIndex.value - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth.value - i,
      isCurrentMonth: false,
      isPast: true,
    })
  }
  //Current month days

  for (let i = 1; i <= daysOfMonth.value; i++) {
    const dayStr = i.toString().padStart(2, '0')
    const monthStr = displayedMonth.value.toString().padStart(2, '0')
    const dateStr = `${displayedYear.value}-${monthStr}-${dayStr}`
    const isReserved = reserved.value.includes(dateStr)
    const dateObj = new Date(dateStr)

    days.push({
      day: i,
      date: dateStr,
      isCurrentMonth: true,
      isToday: i === currentDay.value,
      //   displayedMonth.value === currentMonth.value &&
      //   displayedYear.value === currentYear.value,
      isReserved: isReserved,
      isPast: dateObj < today,
    })
  }

  // Fill with the days from next month
  const total = days.length
  const remaining = 42 - total
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isPast: false,
    })
  }

  return days
})

async function nextMonth(test) {
  const [month, year] = test.split(' ') // Dzieli "Aug 2025" na ["Aug", "2025"]

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}`+'/api/calendar', {
      params: {
        month: month,
        year: year,
        option: 'next',
      },
    })
    monthAndDay.value = res.data.monthAndDay
    daysOfMonth.value = res.data.daysOfTheMonth
    currentDay.value = parseInt(res.data.currentDay)
    firstDayOfMonth.value = res.data.firstDayOfMonth
    daysInPrevMonth.value = res.data.daysInPrevMonth
    firstDayIndex.value = weekDays.indexOf(firstDayOfMonth.value)

    if (displayedMonth.value === 11) {
      displayedMonth.value = 0
      displayedYear.value++
    } else {
      displayedMonth.value++
    }
  } catch (error) {
    console.error('Błąd przy pobieraniu danych kalendarza:', error)
  }
}
async function prevMonth(test) {
  const [month, year] = test.split(' ') // Dzieli "Aug 2025" na ["Aug", "2025"]

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}`+'/api/calendar', {
      params: {
        month: month,
        year: year,
        option: 'prev',
      },
    })

    monthAndDay.value = res.data.monthAndDay
    daysOfMonth.value = res.data.daysOfTheMonth
    currentDay.value = parseInt(res.data.currentDay)
    firstDayOfMonth.value = res.data.firstDayOfMonth
    daysInPrevMonth.value = res.data.daysInPrevMonth
    firstDayIndex.value = weekDays.indexOf(firstDayOfMonth.value)

    if (displayedMonth.value === 0) {
      displayedMonth.value = 11
      displayedYear.value--
    } else {
      displayedMonth.value--
    }
  } catch (error) {
    console.error('Błąd przy pobieraniu danych kalendarza:', error)
  }
}

function haveSameValues(arr1, arr2) {
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)

  for (const val of set1) {
    if (set2.has(val)) return true
  }

  return false
}

function openPayment(isGuest)
{
  const payload = {
    mode:'checkout',
    reservationId: reservation.id,
    isGuest: isGuest,
    canPayLater: true
  }
  paymentStore.openPayment(payload)
}
</script>

<style scoped>

.gradient-border {
  position: relative;
  padding: 12px 40px;
  border-radius: 50px;
  background: white;
  border: 2px solid transparent;
}

/* Gradient border */
.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 4px;
  border-radius: inherit;
  background: linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6);
  background-size: 300% 300%;
  animation: gradientMove 4s linear infinite;

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;

  pointer-events: none;
  transition: background 0.4s ease;
}

/* HOVER – zmiana gradientu */
.gradient-border:hover::before {
  background: linear-gradient(90deg, #22c55e, #06b6d4, #3b82f6);
  background-size: 300% 300%;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

.fade-pop-enter-from {
  opacity: 0;
  transform: scale(0.95); /* lekko pomniejszone przy wejściu */
}
.fade-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); /* łagodne ease-in-out */
}
.fade-pop-enter-to {
  opacity: 1;
  transform: scale(1);
}

.fade-pop-leave-from {
  opacity: 1;
  transform: scale(1);
}
.fade-pop-leave-active {
  transition: all 0.25s ease-in;
}
.fade-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
