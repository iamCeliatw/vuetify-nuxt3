<template lang='pug'>
.content__wrapper 
  .content__container
    h1.article__title 
      p {{ articleData.title }}
      p {{ formatDate(articleData.publish_date) }}
    section.article__content
      .article__content--main 
        p.description(v-html="articleData.description")
        ClientOnly
          p.content(v-html="articleData.content")
      .article__content--info 
        .article__tags 
          span.tag(v-for="tag in tags" :key="tag.id") {{ tag.name }}
</template>

<script lang='ts' setup>
import type { Database } from '~/types/supabase';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css'; 
import '@vueup/vue-quill/dist/vue-quill.snow.css';
const props = defineProps<{
  articleData: Database['public']['Tables']['articles']['Row']
}>()
console.log(props.articleData, 'articleData');
const supabase = useSupabaseClient()

const formatDate = (originalDate) => {
  const date = new Date(originalDate)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

useHead({
  meta: [
    { property: 'og:title', content: props.articleData.title },
    { property: 'og:description', content: props.articleData.description  },
    // ...props.articleData.tags.map(tag => ({   name: 'keywords', content: tag })),
  ],
})



const allTags = ref<Database['public']['Tables']['tags']['Row'][] | null>([])
const { data: tags, pending: tagPending, error: tagError, refresh: tagRefresh } = useAsyncData('tagsData', async () => {
  const { data, error } = await supabase.from('tags').select()
  if (error) {
    console.error('Failed to fetch tags:', error.message)
    throw error
  }
  return data
})


const { data: articleTagsList, pending, error, refresh } = useAsyncData('tagData', async () => {
  const { data, error } = await supabase
    .from('article_tag')
    .select('tag_id')
    .eq('article_id', props.articleData.id)
    if (error) {
    console.error('Failed to fetch article tag data:', error);
    return;
    }
    console.log(articleTagsList.value, props.articleData.id, 'articleTagsList');
    if(data){
      const tags = await supabase.from('tags').select().in('id', data.map((tag) => tag.tag_id))
      console.log(tags.data, 'tags');
    }
    return tags
})
onMounted(() => {
  hljs.highlightAll();
})

</script>

<style lang='sass' scoped>
.content__wrapper 
  width: 100%
  height: 100%
.content__container
  width: 50% 
  margin: 0 auto
.article__title
  justify-content: center
  align-items: center
  display: flex
  flex-direction: column
  height: 150px
  gap: 15px
  border-bottom: 1px solid #666
.article__content
  width: 100%
  display: flex
  margin: 20px 0
.article__content--main 
  width: 70%
  margin-right: 20px
.article__content--info
  width: 30%
  display: flex
  flex-direction: column
  gap: 20px
  .article__tags
    display: flex
    flex-wrap: wrap
    gap: 10px
    .tag
      padding: 5px 10px
      border-radius: 5px
      background-color: #666
      color: #fff
      font-size: 14px
      cursor: pointer
      &:hover
        background-color: #333
        color: #fff
</style>