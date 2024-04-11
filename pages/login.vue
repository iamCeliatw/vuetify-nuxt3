<template lang="pug">
.login__wrapper
  .login__container
    .login__form
      input(v-model="email" type="email")
      input(v-model="password" type="password")
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
.login__wrapper
  width: 100%
  height: 100%
  min-height: 100vh
  position: relative
.login__container
  margin: auto
  // border: 1px solid red
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
.login__form
  display: flex
  flex-direction: column
  gap: 10px
  input
    padding: 10px
    border: 1px solid #ccc
    border-radius: 5px
  button
    padding: 10px
    border: 1px solid #ccc
    border-radius: 5px
    background-color: #ccc
    cursor: pointer
    &:hover
      background-color: #aaa
</style>
