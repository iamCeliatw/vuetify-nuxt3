<template lang='pug'>
section.articlelist__wrapper
  .articlelist__container(v-if="!pending")
    .item(v-for="article in articles" :key="article.id" @click="goToArticle(article.key)")
      h1 {{ article.title }}
  div(v-if="pending")
    p Loading...
  div(v-if="error")
    p Error loading articles
</template>

<script lang='ts' setup>
import Key from '~/pages/article/[key].vue';
import type { Database } from '~/types/supabase';
const router = useRouter()
const props = defineProps<{
  articles: Database['public']['Tables']['articles']['Row'][]
  pending: boolean
  error: Error | null
}>()
const goToArticle = (key: string) => {
  console.log(key);
  window.location.href = `/article/${key}`
  // router.push(`/article/${key}`)
} 
</script>

<style lang='sass' scoped>
  
</style>