<template lang="pug">
ClientOnly
  NuxtLayout
    .form-wrapper.w-75.py-12.ma-auto
      form
        v-text-field(v-model="state.title" :counter="10" :error-messages="v$.title.$errors.map(e => e.$message)" label="Title" required @blur="v$.title.$touch" @input="v$.title.$touch")
        v-text-field(v-model="state.description" :error-messages="v$.description.$errors.map(e => e.$message)" label="Description" required @blur="v$.description.$touch" @input="v$.description.$touch")
        v-select(v-model="state.category_id" :error-messages="v$.category_id.$errors.map(e => e.$message)" :items="categoriesList" label="Category" required item-title="name" item-value="id" @blur="v$.category_id.$touch" @change="v$.category_id.$touch")
        v-text-field(type="date" label="Date" v-model="state.publish_date" )
        Editor(@updateValue="handleContent", :content="state.content" v-model="state.content")
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

const state = reactive({
  ...initialState,
})
watch(() => state, (value) => {
 console.log(value,"送出的資料");
}, { deep: true })
const onDateSelected = (date: string) => {
  const timestamp = new Date(date).getTime();
  console.log(timestamp);
  openCalender.value = false
}
//監聽編輯器文字
const handleContent = (content:string) => {
  if (!content === undefined) {
    return;
  }
  state.content = content
};

const categoriesList = ref<Database['public']['Tables']['categories']['Row'][] | null>([]) 
const rules = {
  title: { required },
  description: { required },
  category_id: { required },
  status: { required },
  publish_date: { required },
}

const categoryDataHandler = async () => {
  try{
    const data = await supabase.from('categories').select();
    console.log(data.data,"category list");
    categoriesList.value = data.data
  } catch (e) {
    console.log('error:', e);
  }
}
const articleDataHandler = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select()
    .eq('id', route.params.id)
    console.log(data,"articleData");
    
    if (error) {
    console.error('Failed to fetch article data:', error);
    return;
    }

    if (data && data.length > 0) {
      const article = data[0];
      state.title = article.title;
      state.description = article.description;
      state.category_id = article.category_id || null;
      state.content = article.content;
      state.publish_date = changeDate(article.publish_date) ?? '';
      state.status = article.status === 1; // 假設 status 存儲為 1 或 0
      console.log("Updated state with article data:", state);
    } else {
      console.log("No article found with the given ID.");
    }
}

const changeDate = (date: string | null) => {
  const date_result = new Date(String(date));
  return date_result.toISOString().split('T')[0]
}

onBeforeMount(async()=>{ 
  await categoryDataHandler()
  if(route.params.id ){
    await articleDataHandler()
  }
})

const v$ = useVuelidate(rules, state)

const submitHandler = async () => {
await v$.value.$validate()
if (!v$.value.$error) {
    try{
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
      }catch(e){
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

<style lang='sass' scoped>

</style>