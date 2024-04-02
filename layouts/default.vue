

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="Vuetify">
      <v-spacer></v-spacer> <!-- 這個元素會將其後的元素推到右邊 -->
      <v-btn @click="signOut">
        <img src="/public/logout.png" alt="">
      </v-btn>
    </v-app-bar>
      <v-navigation-drawer>
        <v-list-item class="list-item" title="My playground" subtitle="dashboard"></v-list-item>
        <v-divider></v-divider>
        <v-list-item class="list-item" href="/admin/posts" title="posts"></v-list-item>
        <v-list-item class="list-item" href="/test" title="account"></v-list-item>
        <v-list-item class="list-item" href="/test" title="settings"></v-list-item>
      </v-navigation-drawer>    
    <v-main>
      <slot></slot>
    </v-main>
  </v-layout>
</template>
<script lang="ts" setup>
const supabase = useSupabaseClient();
const signOut = async () => {
  await supabase.auth.signOut();
  console.log('signOut');
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
  margin: 10px 20px
</style>
