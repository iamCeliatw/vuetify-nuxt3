<template lang="pug">
.content__wrapper 
  .content__container
    h1.article__title 
      p {{ articleData.title }}
      p {{ formatDate(articleData.publish_date) }}
      .count__container
        img(src="/images/eyes.png" alt="tag", height="100") 
        span.article__count view: {{ articleData.count }}
    ClientOnly
      section.article__content
        .article__content--main 
          p.content(v-html="articleData.content")
        .article__content--info 
          .article__outline
            p.outline__title 大綱
            p(v-for="h2 in h2Array") {{ h2 }}
          .article__tags
            span.tag(v-for="tag in articletagList" :key="tag.id") {{ tag.name }}
</template>

<script lang="ts" setup>
import type { Database } from "~/types/supabase";
import { useFetchApi } from "../../composables/supabase-api";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const props = defineProps<{
  articleData: Database["public"]["Tables"]["articles"]["Row"];
}>();
const supabase = useSupabaseClient();
const { getData } = useFetchApi();

// @ts-ignore
const formatDate = (originalDate: string) => {
  const date = new Date(originalDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

useAsyncData("tagsData", async () => {
  const { data, error } = (await getData("tags")) as unknown as {
    data: Database["public"]["Tables"]["tags"]["Row"][] | null;
    error: Error | null;
  };
  if (error) {
    console.error("Failed to fetch tags:", error.message);
    throw error;
  }
  return data;
});

useHead({
  title: props.articleData.title,
  meta: [
    { property: "og:title", content: props.articleData.title },
    { property: "og:description", content: props.articleData.description },
  ],
});

const getContentOutline = (content: string | null) => {
  if (!content || process.server) return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const h2Elements = doc.querySelectorAll("h2");
  const h2Contents: (string | null)[] = [];
  h2Elements.forEach((h2) => {
    h2Contents.push(h2.textContent);
  });
  return h2Contents;
}; // @ts-ignore
const h2Array = computed(() => getContentOutline(props.articleData.content));
// const route = useRoute();
// @ts-ignore
const articletagList = ref<
  Database["public"]["Tables"]["tags"]["Row"][] | null
>([]);
// @ts-ignore
const filter: FilterCondition<"article_tag">[] = [
  {
    column: "article_id",
    operator: "eq",
    value: props.articleData.id,
  },
];

// @ts-ignore
const {
  data: articleTagsList,
  pending,
  error,
  refresh,
} = useAsyncData<Database["public"]["Tables"]["tags"]["Row"] | undefined>(
  "tagData",
  async () => {
    const { data, error } = await supabase
      .from("article_tag")
      .select("tag_id")
      .eq("article_id", props.articleData.id);
    if (error) {
      console.error("Failed to fetch article tag data:", error);
      return;
    }
    if (data) {
      const tags = await supabase
        .from("tags")
        .select()
        .in(
          "id",
          data.map((tag) => tag.tag_id)
        );
      articletagList.value = tags.data;
    }
  }
);
onMounted(async () => {
  hljs.highlightAll();
  if (props.articleData.count !== null) {
    const { data, error } = await supabase
      .from("articles")
      .update(
        // @ts-ignore
        { count: props.articleData.count + 1 }
      )
      .eq("id", props.articleData.id);
  }
});
</script>

<style lang="sass" scoped>
@import "../../assets/breakpoint"
.content__wrapper
  width: 100%
  height: 100%
.content__container
  width: 65%
  margin: 0 auto
  @include breakPoint(size-768 ,null)
    width: 90%

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
  @include breakPoint(size-768 ,null)
    flex-direction: column-reverse

.article__content--main
  width: 70%
  margin-right: 20px
  @include breakPoint(size-768 ,null)
    width: 100%
.article__content--info
  width: 30%
  display: flex
  flex-direction: column
  gap: 20px
  @include breakPoint(size-768 ,null)
    width: 100%
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
.article__count
  font-size: 13px
.count__container
  display: flex
  gap: 5px
  align-items: center
  img
    width: 20px
    height: 20px

.outline__title
  font-size: 24px
  font-weight: 700
</style>
