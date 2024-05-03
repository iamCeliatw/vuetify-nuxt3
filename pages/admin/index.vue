<template lang="pug">
ClientOnly
  NuxtLayout
    .test
      h1 admin
</template>
  
<script setup lang="ts">
import { reactive, ref } from "vue";

const supabase = useSupabaseClient()
const colorMode = useColorMode()
definePageMeta({
  middleware: 'auth',
  colorMode: 'light'
});
</script>

<style lang="sass" scoped>
.test
  color: red
</style>