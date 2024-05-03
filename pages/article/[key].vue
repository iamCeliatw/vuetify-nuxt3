<template lang='pug'>
HomepageNavbar
section.article__wrapper
  .article__container 
    HomepageContent(:articleData="articles[0]", v-if="articles")

</template>

<script lang='ts' setup>
import { indexStore } from "../../store/index";
import type { Database } from '~/types/supabase';
// definePageMeta({
//   colorMode: 'dark',
// })


//home page 放留言板 介紹 連結
const supabase = useSupabaseClient()
const articleList = ref<Database['public']['Tables']['articles']['Row'][] | null>([])
const route = useRoute()
console.log(route.params.key, 'route');
const fetchArticles = async (key:string[] | string) => {
  const { data, error } = await supabase.from('articles').select().eq('key', key);
  if (error) {
    console.error('Failed to fetch articles:', error.message);
    throw new Error('Failed to fetch articles');
  }
  return data;
};
const key = ref(route.params.key)
const { data: articles, pending, error, refresh } = useAsyncData('articlesData', () => fetchArticles(route.params.key), {
  watch: [key]  
 });
</script>

<style lang='sass' scoped>
.test
  color: red
</style>