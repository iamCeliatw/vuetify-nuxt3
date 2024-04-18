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

</template>

<script lang='ts' setup>
import type { Database } from '../../../types/supabase';
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

watch(() => editTag, (value) => {
  // console.log(value,"送出的資料");
}, { deep: true })
const tagsList = ref<Database['public']['Tables']['tags']['Row'][]>([])
const tagHandler = async () => {
  loading.value = true
  const { data, error } = await supabase.from('tags').select()
  if (data) {
    tagsList.value = data
    loading.value = false
    // console.log(tagsList.value, 'tagsList');
  } else {
    // console.log('error:', error);
  }
}

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
        alert('Tag name already exists')
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
        alert('Tag name already exists')
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
    const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', item.id)
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
</style>