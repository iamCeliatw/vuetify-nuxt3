

<template lang="pug">
v-layout.rounded.rounded-md
  v-app-bar(title="Vuetify")
    v-spacer
    v-btn(@click="signOut")
      img(src="public/logout.png" alt="")
  v-navigation-drawer
    v-list-item.list-item(title="My playground" subtitle="dashboard")
    v-divider
    v-list-item.list-item(@click="() => router.push('/admin/posts')" title="post")
    v-list-item.list-item(@click="() => router.push('/admin/category')" title="category")
    v-list-item.list-item(@click="() => router.push('/admin/images')" title="images")
    v-list-item.list-item(@click="() => router.push('/admin/posts')" title="account")
    v-list-item.list-item(@click="() => router.push('/admin')" title="setting")
  v-main
    slot
</template>
<script lang="ts" setup>
const router = useRouter();
const supabase = useSupabaseClient();
const signOut = async () => {
  await supabase.auth.signOut();
  console.log('signOut');
  router.push('/login');
}

onMounted(async() => {
  const user =  await supabase.auth.getUser();
  console.log('onMounted',user);
})

</script>
<style scoped lang="sass">
img
  width: 25px
  height: 25px
.list-item
  margin: 8px 20px

.v-main
  margin: 67px 0 0 255px
</style>
