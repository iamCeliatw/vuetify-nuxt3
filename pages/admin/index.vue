<template lang="pug">
ClientOnly
  NuxtLayout
    .testt 
      h1 admin
</template>
  
<script setup lang="ts">
import { reactive, ref } from "vue";

const supabase = useSupabaseClient()

definePageMeta({
  middleware: 'auth'
});

</script>

<style lang="sass" scoped>
.test
  color: red
</style>