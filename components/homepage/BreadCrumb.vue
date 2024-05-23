<template lang="pug"> 
//- ClientOnly
.breadCrumb__wrapper
  v-breadcrumbs(:items="items")
    template(v-slot:divider)
      v-icon(icon="mdi-chevron-right")
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue';
// import { useRoute, useRouter } from 'nuxt/app';
type BreadCrumb = {
  title:  {} | undefined;
  href: string;
  disabled: boolean;
}
const route = useRoute();
const router = useRouter();
const reactiveRoute = reactive({
  path: route.path,
  matched: route.matched,
  params: route.params
});
const items = ref<BreadCrumb[]>([]);

const updateItems = () => {
  let breadcrumbItems: BreadCrumb[] = [];

  if (reactiveRoute.path !== '/') {
    breadcrumbItems = reactiveRoute.matched.map((match, index) => {
      const title = match.meta.title || match.name;
      const href = match.path.replace(/\/:([^/]+)/g, (_, key) => `/${reactiveRoute.params[key]}`);
      return {
        title,
        disabled: index === reactiveRoute.matched.length - 1,
        href,
      };
    });
  }
  breadcrumbItems.unshift({
    title: 'Home',
    href: '/',
    disabled: reactiveRoute.path === '/',
  });

  items.value = breadcrumbItems;
};

updateItems();

watch(reactiveRoute, () => {
  updateItems();
});

</script>

<style lang='sass' scoped>
.breadCrumb__wrapper
  width: auto
  max-width: 800px
  margin: auto
</style>