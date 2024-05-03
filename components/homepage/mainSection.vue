<template lang="pug">
section.main__wrapper 
  .main__container 
    .article__container(v-for="article in articles" :key="article.id" @click="goToArticle(article.key)")
      h1.article__title {{ article.title }}
      hr.article__hr
      .article__date {{ dateFormat(article.publish_date) }}
      p.article__desc {{ article.description }}
    div(v-if="pending")
      p Loading...
    div(v-if="error")
      p Error loading articles
</template>

<script lang="ts" setup>
import type { Database } from '~/types/supabase';
const props = defineProps<{
  articles: Database['public']['Tables']['articles']['Row'][]
  pending: boolean
  error: Error | null
}>()
console.log(props.articles,"props~");
const goToArticle = (key: string) => {
  console.log(key);
  window.location.href = `/article/${key}`
} 
const dateFormat = (originalDate: string | number | Date) => {
  const date = new Date(originalDate)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

</script>

<style lang="sass" scoped>
.main__wrapper
  max-width: 1200px
  width: 100%
  height: 100%
  margin: 60px auto
  padding: 0 20px
.main__container
  display: flex
  flex-direction: column
  gap: 50px
  width: 80%
  height: 100%
  margin: 0 auto
.article
  &__container
    display: flex
    flex-direction: column

  &__content
    font-size: 20px
    margin-top: 20px
.article__hr
  border-color: var(--border-color)
  opacity: 0.3
.article__desc
  margin-top: 10px
</style>
