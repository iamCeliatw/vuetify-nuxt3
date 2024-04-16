<template lang="pug">
ClientOnly
  NuxtLayout
    v-card.h-auto(title="Articles", flat)
      .button__container
        v-btn(color="primary", @click="addItem")
          | Add
      v-text-field(v-model="search", label="Search", prepend-inner-icon="mdi-magnify", variant="outlined", hide-details, single-line)
      v-data-table(:hover="true", :headers="headers", :items="articleList", :search="search"  v-if="!loading")
        template(v-slot:item.actions="{ item }")
          v-btn(small, color="primary" @click="editItem(item)" class="mr-4")
            | edit
          v-btn(small, color="error" @click="deleteItem(item)")
            | delete

    
      v-row(justify="center" align="center" v-if="loading")
        v-progress-circular(indeterminate :size="40")
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase';
const supabase = useSupabaseClient()
const router = useRouter()
const search = ref('')
const headers = ref([
  { text: 'Title', value: 'title', title:'title'},
  { text: 'Category', value: 'category_id',title:'category' },
  { text: 'Publish_date', value: 'publish_date',title:'publish date' },
  { text: 'Status', value: 'status',title:'status' },
  { text: 'actions', value: 'actions', sortable: false },
])
const loading = ref(true)

const articleList = ref<Database['public']['Tables']['articles']['Row'][] | null>([])

const addItem = () => {
  router.push('/admin/posts/edit')
}

const editItem = (item:{id:number}) => {
  router.push(`/admin/posts/edit/${item.id}`)
}

const articleDataHandler = async () => {
  loading.value = true
  try{
    const data = await supabase.from('articles').select();
    loading.value = false
    console.log(data,"articleList");
    articleList.value = data.data
  } catch (e) {
    console.log('error:', e);
  }
}

//要再做一層防呆 避免誤按
const deleteItem = async (item: {id:number}) => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', item.id)
    //delete 後重新撈取資料
    await articleDataHandler()
}

onMounted(async() => {
 await articleDataHandler()
})

</script>

<style lang="sass" scoped>

</style>