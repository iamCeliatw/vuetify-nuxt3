<template lang="pug">
ClientOnly
  NuxtLayout
    .form-wrapper.w-75.py-12.ma-auto
      form
        v-text-field(v-model="state.title" :counter="10" :error-messages="v$.title.$errors.map(e => e.$message)" label="Title" required @blur="v$.title.$touch" @input="v$.title.$touch")
        v-text-field(v-model="state.description" :error-messages="v$.description.$errors.map(e => e.$message)" label="Description" required @blur="v$.description.$touch" @input="v$.description.$touch")
        v-select(v-model="state.category_id" :error-messages="v$.category_id.$errors.map(e => e.$message)" :items="categoriesList" label="Category" required item-title="name" item-value="id" @blur="v$.category_id.$touch" @change="v$.category_id.$touch")
        v-text-field(type="date" label="Date" v-model="state.publish_date" )
        AdminEditor(@updateValue="handleContent", :content="state.content" v-model="state.content")
        v-autocomplete.my-4(v-model="selectedTags" multiple clearable chips label="tags" :items="tagsList" varient="solo" item-title="name" item-value="id")
        v-switch(v-model="state.status" :label='state.status ? "上架" : "下架" ' hide-details inset required)
        .my-4
        v-btn(class="me-4" @click="submitHandler") submit
        v-btn(@click="clear") clear
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import type { VAlert } from 'vuetify/components';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import type { Database } from '../../../../types/supabase';
import { useFetchApi, type FilterCondition } from "../../../../composables/supabase-api";
const { getData } = useFetchApi();
const supabase = useSupabaseClient<Database>()
const route = useRoute()
const initialState = {
  title: '' as string | null,
  description: '' as string | null,
  category_id: null as number | null,
  content: '' as string | null,
  publish_date: '',
  status: true,
}
const openCalender = ref(false)
const tagsList = ref<Database['public']['Tables']['tags']['Row'][] | null>([])
const categoriesList = ref<Database['public']['Tables']['categories']['Row'][] | null>([]) 
const selectedTags = ref<number[] | null>([])
const oldSelectedTags = ref<number[]>([])
const articleId = ref(route.params.id)
const state = reactive({
  ...initialState,
})


watch(() => state.content, (newContent) => {
  // Update the content of AdminEditor when state.content changes
  if(newContent) { 
    handleContent(newContent);
  }
});
const onDateSelected = (date: string) => { 
  const timestamp = new Date(date).getTime();
  openCalender.value = false
}
//監聽編輯器文字
const handleContent = (content:string) => {
  if (!content === undefined) {
    return;
  }
  state.content = content
};
const TagDataHandler = async () => {
  tagsList.value = await getData('tags')
}

const rules = {
  title: { required },
  description: { required },
  category_id: { required },
  status: { required },
  publish_date: { required },
}

const categoryDataHandler = async () => {
  try{
    categoriesList.value  = await getData('categories')
  } catch (e) {
    console.log('error:', e);
  }
}
const articleDataHandler = async () => {
  // const { data, error } = await supabase
  //   .from('articles')
  //   .select()
  //   .eq('id', route.params.id)
  const filter:FilterCondition<'articles'>[] = [{ column: 'id', operator: 'eq', value: route.params.id }];
  const articles = await getData('articles', filter);


    if (articles && articles.length > 0) {
      const article = articles[0];
      state.title = article.title;
      state.description = article.description;
      state.category_id = article.category_id || null;
      state.content = article.content;
      state.publish_date = changeDate(article.publish_date) ?? '';
      state.status = article.status === 1;

    } else {
      console.log("No article found with the given ID.");
    }
}
const articleTagHandler = async () => {
  const { data, error } = await supabase
    .from('article_tag')
    .select('tag_id')
    .eq('article_id', route.params.id)
    if (error) {
    console.error('Failed to fetch article tag data:', error);
    return;
    }
    if (data) {
      oldSelectedTags.value = data.map((tag) => tag.tag_id);
      selectedTags.value = data.map((tag) => tag.tag_id);
    }
}

//比對文章新舊tag
const compareTags = (currentTags:number[], newTags:number[]) => {
  const tagsToAdd = newTags.filter(tag => !currentTags.includes(tag));
  const tagsToRemove = currentTags.filter(tag => !newTags.includes(tag));
  return { tagsToAdd, tagsToRemove };
}

//移除資料庫tag
const removeTags = async (articleId:number, tagToRemove:number[]) => {
    tagToRemove.forEach(async (removeId) => {
      const { error } = await supabase
        .from('article_tag')
        .delete()
        .eq('article_id', articleId)
        .eq('tag_id', removeId);
      if (error) {
        console.error('Error removing tags:', error);
      }
    }
  ) 
}
//新增資料庫tag
const addTags = async (articleId:number, tagsToAdd:number[]) => {
    tagsToAdd.forEach(async (tagId) => {
      const { error } = await supabase
        .from('article_tag')
        .insert({ article_id: articleId, tag_id: tagId, sort: 0 });
      if (error) {
        console.error('Error adding tags:', error);
      }
    }
  )
}

//更新編輯完的tag
const updateArticleTags = async (articleId:number, newTags:number[]) => {
    const { tagsToAdd, tagsToRemove } = compareTags(oldSelectedTags.value, newTags);
    if (tagsToRemove.length > 0) {
      await removeTags(articleId, tagsToRemove);
    }
    if (tagsToAdd.length > 0) {
      await addTags(articleId, tagsToAdd);
    }
}

const changeDate = (date: string | null) => {
  const date_result = new Date(String(date));
  return date_result.toISOString().split('T')[0]
}

onBeforeMount(async() => { 
  await categoryDataHandler()
  if(route.params.id){
    await articleDataHandler()
    await TagDataHandler()
    await articleTagHandler()
  }
})

const v$ = useVuelidate(rules, state)

const submitHandler = async () => {
  await v$.value.$validate()
  if (!v$.value.$error) {
    try {
      const { error } = await supabase
      .from('articles')
      .update({ 
        title: state.title,
        description: state.description,
        category_id: state.category_id,
        content: state.content,
        publish_date: state.publish_date,
        status: state.status ? 1 : 0,})
      .eq('id', route.params.id)
        await updateArticleTags(Number(route.params.id), selectedTags.value ?? []);
      } catch(e) {
        console.log(e);
      }
  }
}

const clear = () => {
  v$.value.$reset()
  for (const [key, value] of Object.entries(initialState)) {
    (state as Record<string, typeof value>)[key] = value
  }
}
</script>