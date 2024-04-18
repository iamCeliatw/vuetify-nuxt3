<template lang="pug">
ClientOnly
  NuxtLayout
    v-card(title="Category", flat)
      template
        v-text-field(v-model="search", label="Search", prepend-inner-icon="mdi-magnify", variant="outlined", hide-details, single-line)
      .button__container
        v-btn(color="primary")
          | Add
      v-data-table(:hover="true", :headers="headers", :items="categoryList", :search="search")
        template(v-slot:item.actions="{ item }")
          v-btn(small, color="primary" @click="editItem(item)" class="mr-4")
            | edit
          v-btn(small, color="error" @click="deleteItem(item)")
            | delete
</template>


<script lang='ts' setup>
import { onMounted } from 'vue';
import type { Database } from '~/types/supabase';
const supabase = useSupabaseClient()
const router = useRouter()
const search = ref('')
const headers = ref([
  { text: 'name', value: 'name', title:'name'},
  { text: 'actions', value: 'actions', sortable: false },
])

const categoryList = ref<Database['public']['Tables']['categories']['Row'][] | null>([])

const categoriesDataHandler = async () => {
  try{
    const data = await supabase.from('categories').select();
    categoryList.value = data.data
  } catch (e) {
    console.log('error:', e);
  }
}
onMounted(async() => {
 await categoriesDataHandler()
})
</script>
