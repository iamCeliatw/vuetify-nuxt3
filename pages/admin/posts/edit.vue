<template lang="pug">
ClientOnly
  NuxtLayout
    .form-wrapper.w-75.py-12.ma-auto
      form
        v-text-field(v-model="state.title" :counter="10" :error-messages="v$.title.$errors.map(e => e.$message)" label="Title" required @blur="v$.title.$touch" @input="v$.title.$touch")
        v-text-field(v-model="state.description" :error-messages="v$.description.$errors.map(e => e.$message)" label="Description" required @blur="v$.description.$touch" @input="v$.description.$touch")
        v-select(v-model="state.category_id" :error-messages="v$.category_id.$errors.map(e => e.$message)" :items="categoriesList" label="Category" required item-title="name" item-value="id" @blur="v$.category_id.$touch" @change="v$.category_id.$touch")
        v-text-field(type="date" label="Date" v-model="state.publish_date" )
        Editor(@updateValue="handleContent")
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
import type { Database } from '../../../types/supabase';
const supabase = useSupabaseClient<Database>()
const initialState = {
  title: '',
  description: '',
  category_id: null,
  content: '',
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


const rules = {
  title: { required: required },
  description: { required },
  category_id: { required },
  status: { required },
  publish_date: { required },
  // content: {  },
}

const { data: categoriesList, pending, error, refresh } = useAsyncData('categories', async () => {
  const { data, error } = await supabase.from('categories').select();
  if (error) throw new Error('Failed to fetch articles');
  return JSON.parse(JSON.stringify(data));
});

const v$ = useVuelidate(rules, state)

const submitHandler = async () => {
await v$.value.$validate()
if (!v$.value.$error) {
  try{
  const { data, error } = await supabase.from('articles').insert({
    title: state.title,
    description: state.description,
    category_id: state.category_id,
    content: state.content,
    publish_date: state.publish_date,
    status: state.status ? 1 : 0,
  });
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