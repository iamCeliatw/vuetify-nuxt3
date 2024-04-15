<template lang="pug">
.flex__container
  input(type="file" @change="handleFileUpload($event)")
</template>

<script setup lang="ts">
import { ref } from 'vue';
const supabase = useSupabaseClient()

let selectedFile: Ref<File | null> = ref(null);

//上傳圖片
const handleFileUpload =async (event: any) => {
  selectedFile.value = event.target.files[0]
  if(!selectedFile.value) return
  console.log(event.target.files[0].name)
  const { data, error } = await supabase
  .storage
  .from('test')
  .upload(`${event.target.files[0].name}`, selectedFile.value, {
    cacheControl: '3600',
    upsert: false
  })
  console.log(data,"data");
  if (error) console.log(error)
}

//取得所有檔案的url
const { data, error } = await supabase.storage
  .from('test')
  .list();

if (error) {
  console.log('Error listing files:', error.message);
}

if(data?.length){
  data.forEach(async(file) => {
    const { data: fileData} = supabase.storage.from('test').getPublicUrl(file.name);
if (fileData) {
      console.log(fileData, "Downloaded data");
    }
  });
}

</script>

<style lang="sass" scoped>
.flex__container
  width: 50%
  display: flex
  gap: 10px
  flex-direction: column
.custom
  border: 1px solid red
input
  border: 1px dashed green
</style>
