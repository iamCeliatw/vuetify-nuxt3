<template lang="pug">
.category__wrapper 
    .category__container
        .category__title(v-for="category in categoryList" :key="category.id" @click="() => $router.push(`/category/${category.name}`)")
            h3 {{ category.name }}
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient();
//@ts-ignore
const { data: categoryList, error } = await useAsyncData(
  "category",
  async () => {
    const { data, error } = await supabase.from("categories").select();
    if (error) {
      console.error("Failed to fetch profile:", error.message);
      throw error;
    }
    return data;
  }
);
</script>

<style lang="sass" scoped>
.category
    &__wrapper
        width: 100%
        max-width: 800px
        margin: 0 auto
        padding: 0 15px
    &__container
        width: 100%
        display: flex
        flex-wrap: wrap
        gap: 8px
    &__title
        margin-bottom: 1rem
        background: #f0f0f5
        width: fit-content
        color: #444
        padding: 4px 12px
        border-radius: 4px
        cursor: pointer
        background-size: 200% 200%
        transition: all 0.5s
        &:hover
            background-image: linear-gradient(to left, #ebbba7 0%, #cfc7f8 100%)
            color: #444
            animation: gradient 3s ease infinite
@keyframes gradient
    0%
        background-position: 0% 50%

    50%
        background-position: 100% 50%

    100%
        background-position: 0% 50%
</style>
