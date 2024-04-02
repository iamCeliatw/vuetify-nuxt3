<template lang="pug">
.flex__container
  input(v-model="email" type="email")
  input(v-model="password" type="password")
  input(type="file" @change="handleFileUpload($event)")
  button.custom(@click="signInWithEmail") Sign In with E-Mail
</template>

<script setup lang="ts">
import { ref } from 'vue';
const router = useRouter()
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const signInWithEmail = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
  email: email.value,
  password: password.value,
})
  if(data)
  console.log(data);
  if (data?.user) router.push('/admin');
  if (error) console.log(error)
}
onMounted(async () => {
  const user = await supabase.auth.getUser()
  if (user) router.push('/admin') 
})
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
