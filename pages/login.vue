<template lang="pug">
section.login__wrapper
  section.login__container
    .login__form
      h3 Sign In
      label(for="email" type="email") email: 
      input(v-model="email" type="email")
      label(for='password') password:
      input(v-model="password" type="password")
      button.custom(@click="signInWithEmail") LOGIN 🚀
  section.alert__wrapper(v-if="showError")
    .alert__container 
      v-alert(closable
        title="Error"
        :text="errorMessage"
        type="error"
        class="alert__padding"
        width="300px" 
        height="100px"
        @click:close="showError = false"
        )
</template>

<script setup lang="ts">
import { ref } from "vue";
const router = useRouter();
const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const showError = ref(false);
const errorMessage = ref<string | undefined>("");
const signInWithEmail = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (data?.user) router.push("/admin");
  if (error) {
    console.log(error);
    showError.value = true;
    errorMessage.value = error.message;
  }
};
onMounted(async () => {
  const data = await supabase.auth.getSession();
  console.log(data, "user");
  if (data.data.session?.user) router.push("/admin");
});
</script>

<style lang="sass" scoped>
.login__wrapper
  width: 100%
  height: 100%
  min-height: 100vh
  position: relative
  background: #83a4d4
  background: -webkit-linear-gradient(right, #b6fbff, #83a4d4)
  background: linear-gradient(to right, #b6fbff, #83a4d4)

.login__container,
.alert__container
  margin: auto
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
.login__form
  display: flex
  flex-direction: column
  gap: 10px
  h3
    text-align: center
    // color: #696969
  input
    padding: 5px 10px
    border: 1px solid #ffffffaa
    border-radius: 5px
    // border: none
    &:focus
      outline: none
  button
    padding: 10px
    border-radius: 5px
    background-color: #fff
    cursor: pointer
    transition: all 0.3s
    color: #333
    &:hover
      opacity: 0.8
      color: #fff
      background-color: #333
.alert__wrapper
  width: 100%
  height: 100%
  min-height: 100vh
  top: 0
  left: 0
  position: absolute
  backdrop-filter: blur(5px)
.alert__padding
  padding: 10px
</style>
