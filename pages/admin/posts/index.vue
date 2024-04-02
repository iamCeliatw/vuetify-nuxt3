<template lang="pug">
ClientOnly
  NuxtLayout
    v-card(title="Nutrition", flat)
      template(v-slot:text)
        v-text-field(v-model="search", label="Search", prepend-inner-icon="mdi-magnify", variant="outlined", hide-details, single-line)
      v-data-table(:hover="true", :headers="headers", :items="desserts", :search="search")
</template>

<script setup lang="ts">
const search = ref('')
const headers = ref([
  { text: 'title', value: 'title', title:'title'},
  { text: 'summary', value: 'summary',title:'summary' },
  { text: 'publish_date', value: 'publish_date',title:'publish_date' },
  { text: 'status', value: 'status',title:'status' },
  { text: 'cover_image', value: 'cover_image',title:'cover_image' },
])
const desserts = ref([
  {
    name: 'Frozen Yogurt',
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
  {
    title: 159,
    summary: 6.0,
    publish_date: 24,
    status: 4.0,
    cover_image: 1,
  },
])

</script>

<style lang="sass" scoped>
.test

</style>