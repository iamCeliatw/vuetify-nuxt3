<template lang="pug">
ClientOnly
  NuxtLayout
    .form-wrapper.w-75.py-12.ma-auto
      form
        v-text-field(v-model="state.title" :counter="10" :error-messages="v$.title.$errors.map(e => e.$message)" label="Title" required @blur="v$.title.$touch" @input="v$.title.$touch")
        v-text-field(v-model="state.description" :error-messages="v$.description.$errors.map(e => e.$message)" label="Description" required @blur="v$.description.$touch" @input="v$.description.$touch")
        v-select(v-model="state.category_id" :error-messages="v$.category_id.$errors.map(e => e.$message)" :items="categoriesList" label="Category" required item-title="name" item-value="id" @blur="v$.category_id.$touch" @change="v$.category_id.$touch")
        v-text-field(type="date" label="Date" v-model="state.publish_date" :error-messages="v$.publish_date.$errors.map(e => e.$message)")
        v-autocomplete(v-model="selectedTags" multiple clearable chips label="tags" :items="tagsList" varient="solo" item-title="name" item-value="id")
        //- AdminEditor(@updateValue="handleContent" :content="state.content" v-model="state.content")
        v-switch(v-model="state.status" :label='state.status ? "上架" : "下架" ' hide-details inset required)
        .my-4
        v-btn(class="me-4 px-2" @click="submitHandler") submit
        v-btn(class="px-2" @click="clear") clear
        .alert__popup(v-if="submitPopupOpen && formSuccess")
          v-alert(closable
            title="Info"
            text="success to add article !"
            type="success"
            height="150px"
            class="alert__padding"
            @click:close="redirectToList"
            )
        .alert__popup(v-if="submitPopupOpen && !formSuccess")
          v-alert(closable
            title="Info"
            text="error to add article !"
            type="error"
            class="alert__padding"
            )
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import type { VAlert } from 'vuetify/components';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import type { Database } from '../../../../types/supabase';
const router = useRouter()
const supabase = useSupabaseClient<Database>()
const initialState = {
  title: '',
  description: '',
  category_id: null,
  content: '',
  publish_date: '',
  status: true,
}
const selectedTags = ref<number[] | null>([])
const tagsList = ref<Database['public']['Tables']['tags']['Row'][] | null>([])
const openCalender = ref(false)
const redirectToList = () => {
  // router.push('/admin/posts')
}
const state = reactive({
  ...initialState,
})
watch(() => selectedTags, (value) => {
  // console.log(value.value,"送出的資料");
}, { deep: true })

const onDateSelected = (date: string) => {
  const timestamp = new Date(date).getTime();
  // console.log(timestamp);
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
  title: { required: required },
  description: { required },
  category_id: { required },
  status: { required },
  publish_date: { required },
}

const categoryDataHandler = async () => {
  try{
    const data = await supabase.from('categories').select();
    // console.log(data.data,"category list");
    categoriesList.value = data.data
  } catch (e) {
    // console.log('error:', e);
  }
}
onBeforeMount(async()=>{
  await categoryDataHandler()
})
const TagDataHandler = async () => {
  try{
    const data = await supabase.from('tags').select();
    // console.log(data.data,"tagsList list");
    tagsList.value = data.data
  } catch (e) {
    // console.log('error:', e);
  }
}
onBeforeMount(async()=>{
  await categoryDataHandler()
  await TagDataHandler()
})

const v$ = useVuelidate(rules, state)
const formSuccess = ref(false)
const submitPopupOpen = ref(false)
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
      }).select()
      formSuccess.value = !error;
      submitPopupOpen.value = true;
      if(data){
        // console.log(data[0].id,"返回文章資訊");
          selectedTags.value?.forEach(async (tag_id) => {
            await supabase.from('article_tag').insert({
              article_id: data[0].id,
              tag_id: tag_id,
              sort: 0,
          })
        })
      }

    }catch(e){
      // console.log(e);
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
.alert__popup
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  z-index: 2
  // height: 300px
  // backdrop-filter: blur(5px)
  // width: 100%
  // height: 100%
.alert__padding
  padding: 45px 10px
</style>