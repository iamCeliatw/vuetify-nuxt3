<template lang='pug'>
.content__wrapper 
  .content__container
    h1.article__title {{ articleData.title }}
    p.article__description {{ articleData.description }}
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