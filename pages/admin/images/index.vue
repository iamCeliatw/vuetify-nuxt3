<template lang='pug'>
ClientOnly
  NuxtLayout
    v-data-table(:hover="true", :headers="headers", :items="imagesList")
      template(v-slot:item.image="{ item }")
        img(:src="item", alt="Image", height="100")
      template(v-slot:item.actions="{ item }")
        //- v-btn(small, color="primary" @click="editItem(item)" class="mr-4")
        //-   | edit
        v-btn(small, color="error" @click="deleteItem(item)")
          | delete
</template>

<script lang='ts' setup>
const supabase = useSupabaseClient()
//取得所有檔案的url
const imagesList = ref<string[]>([])
  const headers = ref([
  { text: 'image', value: 'image', title:'image'},
  { text: 'actions', value: 'actions', sortable: false },
])
onBeforeMount(async () => {
  const { data, error } = await supabase.storage
    .from('test')
    .list();
  if (error) {
    console.log('Error listing files:', error.message);
  }
  if(data?.length){
    data.forEach(async(file) => {
      const { data: fileData} = supabase.storage.from('test').getPublicUrl(file.name);
      if(fileData){
        console.log(fileData, 'fileData');
        imagesList.value.push(fileData.publicUrl)
        console.log(imagesList.value, 'imagesList');
      }
    });
  }
})
</script>

<style lang='sass' scoped>

</style>