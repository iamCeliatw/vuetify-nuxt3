<template lang="pug">
section.main__wrapper 
  .main__container(v-if="!pending && !error")
    .article__container(v-for="article in articlesByYear" :key="article.id")
      h1.article__title {{ article.year }}
        .article__items--container
          .article__items(v-for="article in article.articles" :key="article.id"  @click="goToArticle(article.key)")
            span.date {{ dateFormat(article.publish_date) }}
            span {{ article.title }}
    div(v-if="pending")
      p Loading...
    div(v-if="error")
      p Error loading articles
</template>

<script lang="ts" setup>
// import type { Database } from "~/types/supabase";
interface Articles {
  id: string
  key: string
  title: string
  publish_date: string
  description: string
  status: number
  content: string
  category_id: number
  count: number
}

const props = defineProps<{
  articles: Articles[]
  pending: boolean
  error: Error | null
}>()
const articlesByYear = ref<{ year: string; articles: unknown }[]>([])

watchEffect(() => {
  if (props.articles) {
    const filteredArticles = props.articles.filter(
      (article) => article.status !== 0
    )
    const groupedByYear = filteredArticles.reduce(
      (acc: { [x: string]: any[] }, article: { publish_date: string }) => {
        const year = article.publish_date.split('-')[0]
        if (!acc[year]) {
          acc[year] = []
        }
        acc[year].push(article)
        return acc
      },
      {}
    )
    const articlesArray = Object.entries(groupedByYear).map(
      ([year, articles]) => {
        articles.sort(
          (a: { publish_date: string }, b: { publish_date: string }) =>
            new Date(b.publish_date).getTime() -
            new Date(a.publish_date).getTime()
        )
        return { year: year, articles: articles }
      }
    )
    articlesArray.sort((a, b) => Number(b.year) - Number(a.year))
    articlesByYear.value = articlesArray
  }
})
const router = useRouter()
// @ts-ignore
const goToArticle = (key: string) => {
  console.log(key)
  router.push(`/article/${key}`)
}
// @ts-ignore
const dateFormat = (originalDate: string | number | Date) => {
  const date = new Date(originalDate)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style lang="sass" scoped>
.main__wrapper
  max-width: 800px
  width: 100%
  height: 100%
  min-height: calc(100vh - 150px)
  margin: auto
  padding: 15px
.main__container
  display: flex
  flex-direction: column
  gap: 50px
  width: 100%
  height: 100%
  margin: 0 auto
.article
  &__container
    display: flex
    flex-direction: column
  &__content
    font-size: 20px
    margin-top: 20px
.article__container
  cursor: pointer

.article__desc
  margin-top: 10px
.article__items--container
  border-left: 1px solid var(--border-color)
.article__items
  margin-bottom: 10px
  padding-left: 25px
  font-size: 16px
  transition: all .2s
  border-left: 1px solid rgba(255, 255, 255, 0)
  &:hover
    border-left: 2px solid var(--border-color)
.article__date
  font-size: 14px
.date
  margin-right: 10px
</style>
