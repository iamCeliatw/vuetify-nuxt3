<template lang='pug'>
ClientOnly
  NuxtLayout
    .button__container 
      div.pa-4.text-center
        v-dialog(color="primary" v-model="dialog" max-width="600" prepend-icon="mdi-plus" class="text-none font-weight-regular" text="ADD" variant="tonal")
          template(v-slot:activator="{ props: activatorProps }")
            v-btn(class="text-none font-weight-regular" prepend-icon="mdi-plus" text="ADD" variant="tonal" v-bind="activatorProps")
          v-card(prepend-icon="mdi-plus" title="Tag name")
            v-card-text
              v-row(dense)
                v-col(cols="14" md="4" sm="6")
                  v-text-field(label="name*" v-model="editTag.name" required)
              small.text-caption.text-medium-emphasis *indicates required field
            v-divider
            v-card-actions
              v-spacer
              v-btn(text="Close" variant="plain" @click="dialog = false")
              v-btn(color="primary" text="Save" variant="tonal" @click="addItem")
    v-row(justify="center" align="center" v-if="loading")
      v-progress-circular(indeterminate :size="40")
    v-data-table(:hover="true", :headers="headers", :items="tagsList" v-if="!loading")
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
    //- AdminAlertPopup(:text="`this tag `" :title="`failed!`" :type="`error`"  :visable="errorMessage.visable")
</template>

<script lang='ts' setup>
import type { Database,Tables } from '../../../types/supabase';
import { useFetchApi } from "../../../composables/supabase-api";
const supabase = useSupabaseClient<Database>()
const dialog =  ref(false)
const loading = ref(true) 
  const headers = ref([
  { text: 'name', value: 'name', title:'Name'},
  { text: 'actions', value: 'actions', sortable: false },
])
const isEditing = ref(false)
const editTag = ref({
  id: 0,
  name: '',
})

const handlePopup = () => {
  errorMessage.value.text = '';
  errorMessage.value.title = '';
  errorMessage.value.visable = false;
}

const tagsList = ref<Database['public']['Tables']['tags']['Row'][]>([])
const { getData, deleteData } = useFetchApi();

const tagHandler = async () => {
  loading.value = true
  tagsList.value = await getData('tags')
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
onBeforeMount(async () => {
  await tagHandler();
})

const addItem = async (item?:Database['public']['Tables']['tags']['Row']) => {
  if (isEditing.value && item){
    try{
      const { error } = await supabase.from('tags').update({
        name: editTag.value.name,
      }).eq('id', editTag.value.id)
      if(error?.code === '23505') {
        errorMessage.value = {
          text: 'Tag name already exists',
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
      const { error } = await supabase.from('tags').insert({
        name: editTag.value.name,
      })
      if(error?.code === '23505') {
        errorMessage.value = {
          text: 'Tag name already exists',
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
  await tagHandler()
  dialog.value = false
  isEditing.value = false
  editTag.value = {
    id: 0,
    name: '',
  }
}
const deleteItem = async (item:Database['public']['Tables']['tags']['Row']) => {
  try{
    //先找出article_tag內 是否有tag_id
    const { data, error } = await supabase.from('article_tag').select('tag_id').eq('tag_id', item.id)
    if(data?.length){
      errorMessage.value = {
        text: 'This tag is used in articles, please remove the tag from the article first',
        title: 'failed!',
        visable: true,
        }
      // alert('This tag is used in articles, please remove the tag from the article first')
      return
    }
    const filter:FilterCondition<'tags'>[] =  [{ column: 'id', operator: 'eq', value: item.id }];
    await deleteData('tags', filter)
    tagsList.value = tagsList.value?.filter((tag) => tag.id !== item.id);
  }catch(e){
    console.log('error:', e);
  }
}

const openEditPopup = (item:Database['public']['Tables']['tags']['Row']) => {
  editTag.value = { ...item }
  isEditing.value = true
  dialog.value = true
}

</script>

<style lang='sass' scoped>
.file 
  position: absolute
  opacity: 0
  overflow: hidden
  width: 66px
  height: 36px
.image 
  object-fit: cover
  width: auto
  height:  auto
  max-width: 30%
.alert__popup
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  z-index: 1000000
// .alert__padding
//   padding: 45px 10px

</style>