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

definePageMeta({
  middleware: 'auth'
});

</script>

<style lang="sass" scoped>
.test
  color: red
</style>