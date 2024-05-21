<template lang="pug">
ClientOnly
  NuxtLayout
    .form-wrapper.w-75.py-12.ma-auto
      form
        v-text-field(v-model="state.title" :counter="10" :error-messages="v$.title.$errors.map(e => e.$message)" label="Title" required @blur="v$.title.$touch" @input="v$.title.$touch")
        v-text-field(v-model="state.key" :counter="10" :error-messages="v$.key.$errors.map(e => e.$message)" label="key" required @blur="v$.key.$touch" @input="v$.key.$touch")
        v-text-field(v-model="state.description" :error-messages="v$.description.$errors.map(e => e.$message)" label="Description" required @blur="v$.description.$touch" @input="v$.description.$touch")
        v-select(v-model="state.category_id" :error-messages="v$.category_id.$errors.map(e => e.$message)" :items="categoriesList" label="Category" required item-title="name" item-value="id" @blur="v$.category_id.$touch" @change="v$.category_id.$touch")
        v-text-field(type="date" label="Date" v-model="state.publish_date" :error-messages="v$.publish_date.$errors.map(e => e.$message)")
        v-autocomplete(v-model="selectedTags" multiple clearable chips label="tags" :items="tagsList" varient="solo" item-title="name" item-value="id")
        AdminEditor(@updateValue="handleContent" :content="state.content" v-model="state.content")
        v-switch(v-model="state.status" :label='state.status ? "上架" : "下架" ' hide-details inset required :color="state.status ? 'success' : 'error'")
        .my-4
        v-btn(class="me-4 px-2" @click="submitHandler") submit 
        v-btn(class="px-2" @click="cancel") cancel
        .alert__popup(v-if="submitPopupOpen && formSuccess")
          v-alert(closable
            title="Info"
            text="success to add article !"
            type="success"
            height="150px"
            class="alert__padding"
            @click:close="redirectToList"
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
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import type { VAlert } from 'vuetify/components';
import '@vueup/vue-quill/dist/vue-quill.snow.css'; 
import type { Database } from '../../../../types/supabase';
import { indexStore } from "../../../../store/index"
import { useFetchApi } from "../../../../composables/supabase-api";
type Image = {
  image: string,
  name: string
}
const { getData } = useFetchApi();
const router = useRouter()
const supabase = useSupabaseClient<Database>()
const store = indexStore();

const initialState = {
  title: '',
  key: '',
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
  router.push('/admin/posts')
}
const state = reactive({
  ...initialState,
})
watch(() => selectedTags, (value) => {
}, { deep: true })

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
const keyRule = helpers.regex('keyFormat', /^[a-zA-Z0-9]+[-_]?[a-zA-Z0-9]*$/)
const categoriesList = ref<Database['public']['Tables']['categories']['Row'][] | null>([]) 
const rules = {
  title: { required: required },
  key: { required },
  description: { required },
  category_id: { required },
  status: { required },
  publish_date: { required },
}

const categoryDataHandler = async () => {
  categoriesList.value = await getData('categories')
} 

const addImage = (image: Image) => {
  store.selectedImage = image
  store.openImagePopup = false
}

onBeforeMount(async()=>{
  await categoryDataHandler()
})

const TagDataHandler = async () => {
    tagsList.value = await getData('tags')
}


onBeforeMount(async()=>{
  await categoryDataHandler()
  await TagDataHandler()
  await imageHandler()
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
      key: state.key,
      description: state.description,
      category_id: state.category_id,
      content: state.content,
      publish_date: state.publish_date,
      status: state.status ? 1 : 0,
      }).select()
      formSuccess.value = !error;
      submitPopupOpen.value = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  } else {
    console.log(`error:${v$.value.$error}`)
  }
}

const cancel = () => {
  router.push('/admin/posts')
}
const loading = ref(true)
const imagesList = ref<Image[]>([])


const imageHandler = async () => {
  loading.value = true
  imagesList.value = []
  const { data, error } = await supabase.storage
    .from('article')
    .list();
  if (error) {
    console.log('Error listing files:', error.message);
  }
  if(data?.length){
    data.forEach(async(file) => {
      const { data: fileData} = supabase.storage.from('article').getPublicUrl(file.name);
      if(fileData){
        imagesList.value.push({image: fileData.publicUrl, name: file.name})
      }
    });
    loading.value = false
  }
}
</script>

<style lang='sass' scoped>

</style>