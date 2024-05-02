export const indexStore = defineStore('index', () => {
  const count = ref(0)
  const openImagePopup = ref(false)
  const selectedImage = ref({})
  const doubleCount = computed(() => count.value * 2)
  function popupHandler() {
    openImagePopup.value = true
  }

  return { count, doubleCount, popupHandler , openImagePopup, selectedImage }
})