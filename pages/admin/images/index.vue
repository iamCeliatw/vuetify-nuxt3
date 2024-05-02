<template lang='pug'>
ClientOnly
  NuxtLayout
    .button__container
      v-btn(color="primary")
        label.fileInput add
        input(id="fileInput" class="file" type="file" @change="uploadFile" accept="image/*")
    v-row(justify="center" align="center" v-if="loading")
      v-progress-circular(indeterminate :size="40")
    v-data-table(:hover="true", :headers="headers", :items="imagesList" v-if="!loading")
      template(v-slot:item.image="{ item }")
        img.image(:src="item.image", alt="Image", height="100")
      template(v-slot:item.actions="{ item }")
        v-btn(small, color="error" @click="deleteItem(item)")
          | delete
</template>

<script lang='ts' setup>
const supabase = useSupabaseClient()
const STORAGE_BUCKET = 'article';
type Image = {
  image: string,
  name: string
}
const loading = ref(true)
const imagesList = ref<Image[]>([])
  const headers = ref([
  { text: 'image', value: 'image', title:'Image'},
  { text: 'actions', value: 'actions', sortable: false },
])

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
const selectedFile = ref<File | null>(null);

const uploadFile = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const { data, error } = await supabase
  .storage
  .from(STORAGE_BUCKET)
  .upload(`${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  })
  if (error){
    console.log(error)
    alert(`error:,${error.message}`)
  } 
  await imageHandler();
}

onBeforeMount(async () => {
  await imageHandler();
})

const deleteItem = async (item:Image) => {
  // console.log(item, 'deleteItem');
  const { data, error } =  await supabase
  .storage
  .from(STORAGE_BUCKET)
  .remove([item.name]);
  if(error){
    console.log('error:', error);
    return
  }
  imagesList.value = imagesList.value.filter((image) => image.name !== item.name)
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