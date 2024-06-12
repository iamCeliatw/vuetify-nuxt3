<template lang="pug">
.about__wrapper 
  HomepageNavbar
  HomepageBreadCrumb
  .about__container 
    .title 
      h1 {{ profile[0].name }}
    .about__content
      p {{ profile[0].about }}
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const { data: profile, error } = await useAsyncData("profile", async () => {
  const { data, error } = await supabase.from("profile").select();
  if (error) {
    console.error("Failed to fetch profile:", error.message);
    throw error;
  }
  return data;
});
</script>

<style lang="sass" scoped>
.about__wrapper
  width: 100%

.about__container
  width: 100%
  max-width: 800px
  margin: 0 auto
  padding: 0 15px
  h1
    margin-bottom: 1rem
</style>
