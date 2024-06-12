<template lang="pug">
ClientOnly
  NuxtLayout
    .admin__container
      h1 Dashboard
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
console.log("supabase init::", supabase);
const colorMode = useColorMode();
definePageMeta({
  middleware: "auth",
  colorMode: "light",
});
</script>

<style lang="sass" scoped>
.admin__container
  padding: 10px
</style>
