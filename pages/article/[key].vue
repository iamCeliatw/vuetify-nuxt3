<template lang="pug">
HomepageNavbar
section.article__wrapper
  .article__container 
    HomepageContent(:articleData="articles[0]", v-if="articles")
</template>

<script lang="ts" setup>
import type { Database } from "~/types/supabase";

const supabase = useSupabaseClient();
const articleList = ref<
  Database["public"]["Tables"]["articles"]["Row"][] | null
>([]);
const route = useRoute();
const fetchArticles = async (key: string[] | string) => {
  const { data, error } = await supabase
    .from("articles")
    .select()
    .eq("key", key);
  if (error) {
    console.error("Failed to fetch articles:", error.message);
    throw new Error("Failed to fetch articles");
  }
  return data;
};

const key = ref(route.params.key);
const {
  data: articles,
  pending,
  error,
  refresh,
} = useAsyncData<Database["public"]["Tables"]["articles"]["Row"][]>(
  "articlesData",
  () => fetchArticles(route.params.key),
  {
    watch: [key],
  }
);

useHead({
  title: articles.value ? articles.value[0].title : "",
  meta: [
    {
      property: "og:title",
      content: articles.value ? articles.value[0].title : "",
    },
    {
      property: "og:description",
      content: articles.value ? articles.value[0].description : "",
    },
  ],
});
</script>

<style lang="sass" scoped>
.test
  color: red
</style>
