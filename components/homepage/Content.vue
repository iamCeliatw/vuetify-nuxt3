<template lang='pug'>
.content__wrapper 
  .content__container
    h1.article__title {{ articleData.title }}
    p.article__description {{ articleData.description }}
    span {{ tags }}
    ClientOnly
      p.article__content(v-html="articleData.content")

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
</style>