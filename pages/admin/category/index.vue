<template lang='pug'>
ClientOnly
  NuxtLayout
    .button__container 
      div.pa-4.text-center
        v-dialog(color="primary" v-model="dialog" max-width="600" prepend-icon="mdi-plus" class="text-none font-weight-regular" text="ADD" variant="tonal")
          template(v-slot:activator="{ props: activatorProps }")
            v-btn(class="text-none font-weight-regular" prepend-icon="mdi-plus" text="ADD" variant="tonal" v-bind="activatorProps")
          v-card(prepend-icon="mdi-plus" title="Category name")
            v-card-text
              v-row(dense)
                v-col(cols="14" md="4" sm="6")
                  v-text-field(label="name*" v-model="editCategory.name" required)
              small.text-caption.text-medium-emphasis *indicates required field
            v-divider
            v-card-actions
              v-spacer
              v-btn(text="Close" variant="plain" @click="dialog = false")
              v-btn(color="primary" text="Save" variant="tonal" @click="addItem")
    v-row(justify="center" align="center" v-if="loading")
      v-progress-circular(indeterminate :size="40")
    v-data-table(:hover="true", :headers="headers", :items="categoryList" v-if="!loading")
      template(v-slot:item.image="{ item }")
        span(alt="tag", height="100")
      template(v-slot:item.actions="{ item }")
        v-btn(small, color="primary" @click="openEditPopup(item)" class="mr-4")
          | edit
        v-btn(small, color="error" @click="deleteItem(item)")
          | delete
    .alert__popup
      v-alert(
        closable
        v-model="errorMessage.visable"
        :title="errorMessage.title"
        :text="errorMessage.text"
        type="error"
        class="alert__padding"
      )
</template>


<script lang='ts' setup>
import { onMounted } from 'vue';
import type { Database } from '~/types/supabase';
import { useFetchApi } from "../../../composables/supabase-api";
definePageMeta({
  colorMode: 'light'
});
const supabase = useSupabaseClient()
const router = useRouter()
const search = ref('')
const headers = ref([
  { text: 'name', value: 'name', title:'name'},
  { text: 'actions', value: 'actions', sortable: false },
])
const { getData, deleteData } = useFetchApi();

const categoryList = ref<Database['public']['Tables']['categories']['Row'][] | null>([])

const categoriesDataHandler = async () => {
  categoryList.value = await getData('categories')
}
const isEditing = ref(false)
const editCategory = ref<Database['public']['Tables']['categories']['Row']>({
  id: 0,
  name: '',
})
const dialog =  ref(false)
const loading = ref(false) 
const categoryHandler = async () => {
  loading.value = true
  categoryList.value = await getData('categories')
  loading.value = false
}
type ErrorMessage = {
  text: string,
  title: string,
  visable: boolean,
}
const errorMessage = ref<ErrorMessage>({
  text: '',
  title: '',
  visable: false,
})
const addItem = async (item?:Database['public']['Tables']['categories']['Row']) => {
  if (isEditing.value && item){
    try{
      const { error } = await supabase.from('categories').update({
        name: editCategory.value.name,
      }).eq('id', editCategory.value.id)
      if(error?.code === '23505') {
        errorMessage.value = {
          text: 'category name already exists',
          title: 'failed!',
          visable: true,
        }
        // alert('Tag name already exists')
        return
      }
    } catch(e) {
      console.log('error:', e);
    }
  } else {
    // console.log('正在創建');
    try{ 
      const { error } = await supabase.from('categories').insert({
        name: editCategory.value.name,
      })
      if(error?.code === '23505') {
        errorMessage.value = {
          text: 'category name already exists',
          title: 'failed!',
          visable: true,
        }
        console.log(errorMessage.value, 'errorMessage');
        // alert('Tag name already exists')
        return
      }
    } catch(e) {
      console.log('error:', e);
    }
  }
  await categoriesDataHandler()
  dialog.value = false
  isEditing.value = false
  editCategory.value = {
    id: 0,
    name: '',
  }
}

const openEditPopup = (item:Database['public']['Tables']['categories']['Row']) => {
  editCategory.value = { ...item }
  isEditing.value = true
  dialog.value = true
}

const deleteItem = async (item:Database['public']['Tables']['categories']['Row']) => {
  try{
    //先找出article_tag內 是否有tag_id
    const { data, error } = await supabase.from('articles').select('category_id').eq('category_id', item.id)
    if(data?.length){
      errorMessage.value = {
        text: 'This category is used in articles, please remove the category from the article first',
        title: 'failed!',
        visable: true,
        }
      return
    }
    const filter:FilterCondition<'categories'>[] =  [{ column: 'id', operator: 'eq', value: item.id }];
    await deleteData('categories', filter)
    if(categoryList.value){
      categoryList.value = categoryList.value?.filter((c) => c.id !== item.id);
    } else {
      await categoriesDataHandler()
    }
  }catch(e){
    console.log('error:', e);
  }
}

onMounted(async() => {
 await categoriesDataHandler()
})

</script>
