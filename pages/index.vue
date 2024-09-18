<template lang="pug">
HomepageNavbar
HomepageBreadCrumb
HomepageMainSection(:articles="articles" :pending="pending" :error="error")
//- HomepageMessageBoard
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const {
  data: articles,
  pending,
  error,
  refresh,
} = useAsyncData('articlesData', async () => {
  const { data, error } = await supabase.from('articles').select()
  if (error) {
    console.error('Failed to fetch articles:', error.message)
    throw error
  }
  return data
})
useHead({
  title: `文章 - Celia's blog`,
  meta: [
    { property: 'og:title', content: `Celia's blog` },
    { property: 'og:description', content: '前端的隨筆紀錄' },
  ],
})
</script>

<style lang="sass" scoped>
.test
  color: red
</style>
