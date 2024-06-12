<template lang="pug"> 
//- ClientOnly
.breadCrumb__wrapper
  v-breadcrumbs(:items="items")
    template(v-slot:divider)
      v-icon(icon="mdi-chevron-right")
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
type BreadCrumb = {
  title: {} | undefined;
  href: string;
  disabled: boolean;
};
const route = useRoute();
const reactiveRoute = reactive({
  path: route.path,
  matched: route.matched,
  params: route.params,
});
const items = ref<BreadCrumb[]>([]);

const updateItems = () => {
  let breadcrumbItems: BreadCrumb[] = [];
  reactiveRoute.matched.forEach((routeRecord) => {
    if (routeRecord.path) {
      const segments = routeRecord.path.split("/").filter((segment) => segment);
      segments.forEach((segment, index) => {
        let segmentTitle: string | string[] = segment;
        // Replace dynamic segment (e.g., :id) with actual value from params
        if (segment.startsWith(":")) {
          // :id() => id
          const paramKey = segment.replace(/[:()]/g, "");
          if (reactiveRoute.params[paramKey]) {
            segmentTitle = reactiveRoute.params[paramKey];
          }
        }
        const href = `/${segments
          .slice(0, index + 1)
          .map((seg) =>
            seg.startsWith(":")
              ? reactiveRoute.params[seg.substring(1)] || seg
              : seg
          )
          .join("/")}`;
        breadcrumbItems.push({
          title: segmentTitle,
          href,
          disabled: false,
        });
      });
    }
  });
  breadcrumbItems.unshift({
    title: "Home",
    href: "/",
    disabled: false,
  });
  if (breadcrumbItems.length > 1) {
    breadcrumbItems[breadcrumbItems.length - 1].disabled = true;
  }

  items.value = breadcrumbItems;
};

updateItems();

watch(
  () => route.path,
  () => {
    reactiveRoute.path = route.path;
    reactiveRoute.matched = route.matched;
    reactiveRoute.params = route.params;
    updateItems();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="sass" scoped>
.breadCrumb__wrapper
  width: auto
  max-width: 800px
  margin: auto
</style>
