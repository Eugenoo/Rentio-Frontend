import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFormDraftStore = defineStore('formDraft', () => {
  const form = ref({
    firstName : '',
    lastName : '',
    email : '',
    phoneNumber : '',
  })

  function updateField (key, value) {
    form.value[key] = value
  }

  function reset() {
    form.value = {
      firstName : '',
      lastName : '',
      email : '',
      phoneNumber : '',
    }
  }

  return {
    form,
    updateField,
    reset
  }
});
