<template lang="pug">
ClientOnly
  NuxtLayout
    .admin__container
      h1 Dashboard
</template>
  
<script setup lang="ts">
import { reactive, ref } from "vue";

const supabase = useSupabaseClient()
const colorMode = useColorMode()
definePageMeta({
  middleware: 'auth',
  colorMode: 'light'
});
// colorMode.preference = 'light'
</script>

<style lang="sass" scoped>
.admin__container
  padding: 10px
  // color: red
</style>