<template lang="pug">
HomepageNavbar
HomepageMainSection(:articles="articles" :pending="pending" :error="error")
HomepageMessageBoard
</template>

<script setup lang="ts">
// import { indexStore } from '../store/index'
import type { Database } from '../types/supabase'
const colorMode = useColorMode()
const supabase = useSupabaseClient()
const articleList = ref<Database['public']['Tables']['articles']['Row'][] | null>([])
const router = useRouter()
const { data: articles, pending, error, refresh } = useAsyncData('articlesData', async () => {
  const { data, error } = await supabase.from('articles').select()

  if (error) {
    console.error('Failed to fetch articles:', error.message)
    throw error
  }
  return data
})
</script>

<style lang="sass" scoped>
.test
  color: red
</style>
