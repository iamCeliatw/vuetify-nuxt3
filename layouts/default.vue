<template lang="pug">
v-layout.rounded.rounded-md
  v-app-bar(color="admin-layout")
    v-app-bar-nav-icon(:icon="hamburger" @click.stop="drawer = !drawer")
    v-toolbar-title {{ "vuetify" }}
    v-spacer
    v-btn(@click="signOut")
      img(src="public/logout.png" alt="")
  v-navigation-drawer(v-model="drawer")
    v-list-item.list-item(title="My playground" subtitle="dashboard")
    v-divider
    v-list-item.list-item.my-2(@click="() => router.push('/admin/posts')" title="post")
    v-list-item.list-item.my-2(@click="() => router.push('/admin/category')" title="category")
    v-list-item.list-item.my-2(@click="() => router.push('/admin/images')" title="images")
    v-list-item.list-item.my-2(@click="() => router.push('/admin/tags')" title="tags")
  v-main
    slot
</template>
<script lang="ts" setup>
const drawer = ref(false);
const router = useRouter();
const supabase = useSupabaseClient();
const signOut = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
const hamburger = ref("mdi-hamburger");
onMounted(async () => {
  const user = await supabase.auth.getUser();
});

watchEffect(() => {
  hamburger.value = drawer.value ? "mdi-hamburger-minus" : "mdi-hamburger";
});
</script>
<style scoped lang="sass">
img
  width: 25px
  height: 25px
</style>
