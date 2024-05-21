<template lang="pug"> 
//- ClientOnly
.breadCrumb__wrapper
  v-breadcrumbs(:items="items")
    template(v-slot:divider)
      v-icon(icon="mdi-chevron-right")
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
type BreadCrumb = {
  title:  {} | undefined;
  href: string;
  disabled: boolean;
}
const route = useRoute();
const router = useRouter();
const items = ref<BreadCrumb[]>([]);

const updateItems = () => {
  let breadcrumbItems:BreadCrumb[] = [];

  if (route.path !== '/') {
    breadcrumbItems = route.matched.map((match, index) => {
      const title = match.meta.title || match.name;
      const href = match.path.replace(/\/:([^/]+)/g, (_, key) => `/${route.params[key]}`);
      return {
        title,
        disabled: index === route.matched.length - 1,
        href,
      };
    });
  }

  // 手动添加首页
  breadcrumbItems.unshift({
    title: 'Home',
    href: '/',
    disabled: route.path === '/',
  });

  items.value = breadcrumbItems;
  // console.log(breadcrumbItems, "bb");
};

// 初始调用一次
updateItems();

// 监听路由变化
watch(route, () => {
  updateItems();
});

</script>

<style lang='sass' scoped>
.breadCrumb__wrapper
  width: auto
  max-width: 800px
  margin: auto
</style>