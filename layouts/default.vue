<template lang="pug">
v-layout.rounded.rounded-md
  v-app-bar(color="admin-layout")
    v-app-bar-nav-icon(:icon="hamburger" @click.stop="drawer = !drawer")
    v-toolbar-title {{ "Admin" }}
    v-spacer
    v-btn(@click="signOut")
      img(src="/logout.png" alt="")
  v-navigation-drawer(v-model="drawer")
    v-divider
    v-list-item.list-item.my-2(@click="() => router.push('/admin/profile')" title="profile")
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
// @ts-ignore
const signOut = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
const hamburger = ref("mdi-hamburger");

watchEffect(() => {
  hamburger.value = drawer.value ? "mdi-hamburger-minus" : "mdi-hamburger";
});
</script>
<style scoped lang="sass">
img
  width: 25px
  height: 25px
</style>
