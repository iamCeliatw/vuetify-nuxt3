<template lang="pug">
ClientOnly
  NuxtLayout
    .testt 
      h1 1123
</template>
  
<script setup lang="ts">
import { reactive, ref } from "vue";
const countries = ref<any[] | null>([])
const supabase = useSupabaseClient()
async function getCountries() {
  const { data } = await supabase.from('user').select()
  countries.value = data
  console.log(countries.value);
}
definePageMeta({
  middleware: 'auth'
});
onMounted(() => {
  getCountries()
})
</script>

<style lang="sass" scoped>
.test
  color: red
</style>