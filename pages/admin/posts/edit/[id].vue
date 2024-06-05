<template lang="pug">
ClientOnly
  NuxtLayout
    .form-wrapper.w-75.py-12.ma-auto
      form
        v-text-field(v-model="state.title" :counter="10" :error-messages="v$.title.$errors.map(e => e.$message)" label="Title" required @blur="v$.title.$touch" @input="v$.title.$touch")
        v-text-field(v-model="state.key" :counter="10" :error-messages="v$.key.$errors.map(e => e.$message)" label="key" required @blur="v$.key.$touch" @input="v$.key.$touch")
        v-text-field(v-model="state.description" :error-messages="v$.description.$errors.map(e => e.$message)" label="Description" required @blur="v$.description.$touch" @input="v$.description.$touch")
        v-select(v-model="state.category_id" :error-messages="v$.category_id.$errors.map(e => e.$message)" :items="categoriesList" label="Category" required item-title="name" item-value="id" @blur="v$.category_id.$touch" @change="v$.category_id.$touch")
        v-text-field(type="date" label="Date" v-model="state.publish_date" )
        AdminEditor(@updateValue="handleContent", :content="state.content" v-model="state.content")
        v-autocomplete.my-4(v-model="selectedTags" multiple clearable chips label="tags" :items="tagsList" varient="solo" item-title="name" item-value="id")
        v-switch(v-model="state.status" :label='state.status ? "上架" : "下架" ' hide-details inset required :color="state.status ? 'success' : 'error'")
        .my-4
        v-btn(class="me-4" @click="submitHandler") submit
        v-btn(@click="cancel") cancel
        .alert__popup(v-if="submitPopupOpen && formSuccess")
          v-alert(closable
            v-model="formSuccess"
            title="Info"
            text="success to edit article"
            type="success"
            height="150px" 
            class="alert__padding"
            )
        .image__popup(v-if="store.openImagePopup")
          v-card(prepend-icon="mdi-plus" title="Photo")
            .image__wrapper(class="d-flex")
              .image__container(v-for="image in imagesList", :key="image.name" @click="addImage(image)")
                img(:src="image.image" alt="image" class="w-100")
            v-card-actions
              v-spacer
              v-btn(text="Close" variant="plain" @click="store.openImagePopup = false")
              v-btn(color="primary" text="Save" variant="tonal")
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { indexStore } from "../../../../store/index";
import type { Database } from "../../../../types/supabase";
import {
  useFetchApi,
  type FilterCondition,
} from "../../../../composables/supabase-api";
type Image = {
  image: string;
  name: string;
};
const imagesList = ref<Image[]>([]);
const loading = ref(true);
const store = indexStore();
const router = useRouter();
const { getData } = useFetchApi();
const supabase = useSupabaseClient<Database>();
const route = useRoute();
const initialState = {
  title: "" as string | null,
  key: "" as string | null,
  description: "" as string | null,
  category_id: null as number | null,
  content: "" as string | null,
  publish_date: "",
  status: true,
};
const formSuccess = ref(false);
const submitPopupOpen = ref(false);

const tagsList = ref<Database["public"]["Tables"]["tags"]["Row"][] | null>([]);
const categoriesList = ref<
  Database["public"]["Tables"]["categories"]["Row"][] | null
>([]);
const selectedTags = ref<number[] | null>([]);
const oldSelectedTags = ref<number[]>([]);
// const articleId = ref(route.params.id);
const state = reactive({
  ...initialState,
});
// @ts-ignore
const addImage = (image: Image) => {
  store.selectedImage = image;
  store.openImagePopup = false;
};

watch(
  () => state.content,
  (newContent) => {
    // Update the content of AdminEditor when state.content changes
    if (newContent) {
      handleContent(newContent);
    }
  }
);

//監聽編輯器文字
const handleContent = (content: string) => {
  if (!content === undefined) {
    return;
  }
  state.content = content;
};
const TagDataHandler = async () => {
  tagsList.value = await getData("tags");
};

const rules = {
  title: { required },
  key: { required },
  description: { required },
  category_id: { required },
  status: { required },
  publish_date: { required },
};

const categoryDataHandler = async () => {
  try {
    categoriesList.value = await getData("categories");
  } catch (e) {
    console.log("error:", e);
  }
};
const articleDataHandler = async () => {
  const filter: FilterCondition<"articles">[] = [
    { column: "id", operator: "eq", value: route.params.id },
  ];
  const articles = await getData("articles", filter);
  if (articles && articles.length > 0) {
    const article = articles[0];
    state.title = article.title;
    state.key = article.key;
    state.description = article.description;
    state.category_id = article.category_id || null;
    state.content = article.content;
    state.publish_date = changeDate(article.publish_date) ?? "";
    state.status = article.status === 1;
  } else {
    console.log("No article found with the given ID.");
  }
};
const articleTagHandler = async () => {
  const { data, error } = await supabase
    .from("article_tag")
    .select("tag_id")
    .eq("article_id", route.params.id);
  if (error) {
    console.error("Failed to fetch article tag data:", error);
    return;
  }
  if (data) {
    oldSelectedTags.value = data.map((tag) => tag.tag_id);
    selectedTags.value = data.map((tag) => tag.tag_id);
  }
};

//比對文章新舊tag
const compareTags = (currentTags: number[], newTags: number[]) => {
  const tagsToAdd = newTags.filter((tag) => !currentTags.includes(tag));
  const tagsToRemove = currentTags.filter((tag) => !newTags.includes(tag));
  return { tagsToAdd, tagsToRemove };
};

//移除資料庫tag
const removeTags = async (articleId: number, tagToRemove: number[]) => {
  tagToRemove.forEach(async (removeId) => {
    const { error } = await supabase
      .from("article_tag")
      .delete()
      .eq("article_id", articleId)
      .eq("tag_id", removeId);
    if (error) {
      console.error("Error removing tags:", error);
    }
  });
};
//新增資料庫tag
const addTags = async (articleId: number, tagsToAdd: number[]) => {
  tagsToAdd.forEach(async (tagId) => {
    const { error } = await supabase
      .from("article_tag")
      .insert({ article_id: articleId, tag_id: tagId, sort: 0 });
    if (error) {
      console.error("Error adding tags:", error);
    }
  });
};

//更新編輯完的tag
const updateArticleTags = async (articleId: number, newTags: number[]) => {
  const { tagsToAdd, tagsToRemove } = compareTags(
    oldSelectedTags.value,
    newTags
  );
  if (tagsToRemove.length > 0) {
    await removeTags(articleId, tagsToRemove);
  }
  if (tagsToAdd.length > 0) {
    await addTags(articleId, tagsToAdd);
  }
};

const changeDate = (date: string | null) => {
  const date_result = new Date(String(date));
  return date_result.toISOString().split("T")[0];
};

const imageHandler = async () => {
  loading.value = true;
  imagesList.value = [];
  const { data, error } = await supabase.storage.from("article").list();
  if (error) {
    console.log("Error listing files:", error.message);
  }
  if (data?.length) {
    data.forEach(async (file) => {
      const { data: fileData } = supabase.storage
        .from("article")
        .getPublicUrl(file.name);
      if (fileData) {
        imagesList.value.push({ image: fileData.publicUrl, name: file.name });
      }
    });
    loading.value = false;
  }
};

onBeforeMount(async () => {
  await categoryDataHandler();
  if (route.params.id) {
    await articleDataHandler();
    await TagDataHandler();
    await articleTagHandler();
    await imageHandler();
  }
});

const v$ = useVuelidate(rules, state);
// @ts-ignore
const submitHandler = async () => {
  await v$.value.$validate();
  if (!v$.value.$error) {
    try {
      const { error } = await supabase
        .from("articles")
        .update({
          title: state.title,
          key: state.key,
          description: state.description,
          category_id: state.category_id,
          content: state.content,
          publish_date: state.publish_date,
          status: state.status ? 1 : 0,
        })
        .eq("id", route.params.id);
      await updateArticleTags(
        Number(route.params.id),
        selectedTags.value ?? []
      );
      formSuccess.value = !error;
      submitPopupOpen.value = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.log(e);
    }
  }
};

// @ts-ignore
const cancel = () => {
  router.push("/admin/posts");
};
</script>

<style lang="sass" scoped></style>
