<template lang="pug">
.flex__container
  input(v-model="email" type="email")
  input(v-model="password" type="password")
  input(type="file" @change="handleFileUpload($event)")
  button.custom(@click="signInWithEmail") Sign In with E-Mail
</template>

<script setup lang="ts">
import { ref } from 'vue';
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const signInWithEmail = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
  email: email.value,
  password: password.value,
})
  console.log(data);
  if (error) console.log(error)
}
let selectedFile: Ref<File | null> = ref(null);


//上傳圖片
const handleFileUpload =async (event: any) => {
  selectedFile.value = event.target.files[0]
  if(!selectedFile.value) return
  console.log(event.target.files[0])
  const { data, error } = await supabase
  .storage
  .from('test')
  .upload('avatar1.png', selectedFile.value, {
    cacheControl: '3600',
    upsert: false
  })
  console.log(data,"data");
  if (error) console.log(error)
}

// 下載圖片
const { data, error } = await supabase.storage.from('public').download('test/avatar1.png')
if (error) {
  console.log('Error downloading file: ', error.message)
} else if (data) {
  console.log(data,"data");
  if(process.client){
    const url = URL.createObjectURL(data)
    const img = document.createElement('img')
    img.src = url
    document.body.appendChild(img)
  }
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
