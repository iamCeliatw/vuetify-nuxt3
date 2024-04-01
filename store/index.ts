export const indexStore = defineStore('index', () => {
  const count = ref(0)
  const supabase = ref()
  const name = ref('Eduardo')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, name, doubleCount, increment, supabase }
})