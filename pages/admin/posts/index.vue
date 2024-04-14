<template lang="pug">
ClientOnly
  NuxtLayout
    v-card(title="Nutrition", flat)
      template
        v-text-field(v-model="search", label="Search", prepend-inner-icon="mdi-magnify", variant="outlined", hide-details, single-line)
      .button__container
        v-btn(color="primary", @click="addItem")
          | Add
      v-data-table(:hover="true", :headers="headers", :items="articleList", :search="search")
        template(v-slot:item.actions="{ item }")
          v-btn(small, color="primary" @click="editItem(item)" class="mr-4")
            | 编辑
          v-btn(small, color="error" @click="deleteItem(item)")
            | 删除
</template>

<script setup lang="ts">
const router = useRouter()
const search = ref('')
const headers = ref([
  { text: 'Title', value: 'title', title:'title'},
  { text: 'Category', value: 'category_id',title:'category' },
  { text: 'Publish_date', value: 'publish_date',title:'publish date' },
  { text: 'Status', value: 'status',title:'status' },
  { text: 'actions', value: 'actions', sortable: false },
])
const supabase = useSupabaseClient()
//ssr get data
const { data: articleList, pending, error, refresh } = useAsyncData('articles', async () => {
  const { data, error } = await supabase.from('articles').select();
  console.log(articleList,"articleList");
  if (error) throw new Error('Failed to fetch articles');
  return data;
});
const addItem = () => {
  router.push('/admin/posts/edit')
}
onMounted(() => {
 
})
</script>

<style lang="sass" scoped>
.button__container
  width: 100%
  display: flex
  justify-content: flex-end
  margin-bottom: 20px
</style>