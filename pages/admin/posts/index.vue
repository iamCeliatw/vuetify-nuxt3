<template lang="pug">
ClientOnly
  NuxtLayout
    v-card.h-auto(title="Articles", flat)
      .button__container
        v-btn(color="primary" @click="addItem" prepend-icon="mdi-plus" class="text-none font-weight-regular" text="ADD" variant="tonal")
      v-text-field(v-model="search", label="Search", prepend-inner-icon="mdi-magnify", variant="outlined", hide-details, single-line)
      v-data-table(:hover="true", :headers="headers", :items="articleList", :search="search"  v-if="!loading")
        template(v-slot:item.actions="{ item }")
          v-btn(small, color="primary" @click="editItem(item)" class="mr-4")
            | edit
          v-btn(small, color="error" @click="openDeleteDialog(item)")
            | delete
      v-row(justify="center" align="center" v-if="loading")
        v-progress-circular(indeterminate :size="40")
      v-dialog(v-model="deleteDialog" width="auto")
        v-card(max-width="400" prepend-icon="mdi-update" text="Are you sure to delete this article?")
          template(v-slot:actions)
            v-btn(class="ms-auto" text="Ok" @click="deleteArticle(item)")
            v-btn(class="ms-auto" text="Close" @click="deleteDialog = false")
    .alert__popup
      v-alert(
        closable
        v-model="errorMessage.visable"
        :title="errorMessage.title"
        :text="errorMessage.text"
        type="error"
        class="alert__padding"
      )
</template>

<script setup lang="ts">
import type { Database } from "~/types/supabase";
import {
  useFetchApi,
  type FilterCondition,
} from "../../../composables/supabase-api";

definePageMeta({
  colorMode: "light",
});
const supabase = useSupabaseClient();
const router = useRouter();
const search = ref("");
const { getData, deleteData } = useFetchApi();
const headers = ref([
  { text: "Title", value: "title", title: "title" },
  { text: "Category", value: "category_id", title: "category" },
  { text: "Publish_date", value: "publish_date", title: "publish date" },
  { text: "Status", value: "status", title: "status" },
  { text: "actions", value: "actions", sortable: false },
]);
const loading = ref(true);
const deleteDialog = ref(false);
const articleList = ref<
  Database["public"]["Tables"]["articles"]["Row"][] | null
>([]);
type ErrorMessage = {
  text: string;
  title: string;
  visable: boolean;
};
const errorMessage = ref<ErrorMessage>({
  text: "",
  title: "",
  visable: false,
});
const addItem = () => {
  router.push("/admin/posts/edit");
};

const editItem = (item: { id: number }) => {
  router.push(`/admin/posts/edit/${item.id}`);
};

const articleDataHandler = async () => {
  loading.value = true;
  articleList.value = await getData("articles");
  articleList.value?.sort(
    (a, b) =>
      new Date(b.publish_date ? b.publish_date : Date.now()).getTime() -
      new Date(a.publish_date ? a.publish_date : Date.now()).getTime()
  );
  loading.value = false;
};
const selectedItem = ref<Database["public"]["Tables"]["articles"]["Row"]>();
const openDeleteDialog = (
  item: Database["public"]["Tables"]["articles"]["Row"]
) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};
const deleteArticle = async () => {
  if (selectedItem.value && articleList.value) {
    const filter: FilterCondition<"articles">[] = [
      { column: "id", operator: "eq", value: selectedItem.value.id },
    ];
    try {
      await deleteData("articles", filter);
      articleList.value = articleList.value?.filter(
        (article) => article.id !== selectedItem.value?.id
      );
      deleteDialog.value = false;
    } catch (error) {
      console.log(error);
      deleteDialog.value = false;
      if ((error as any)?.code === "23503") {
        errorMessage.value = {
          text: "This article is in use, cannot be deleted!",
          title: "failed!",
          visable: true,
        };
      }
    }
  }
};
onMounted(async () => {
  await articleDataHandler();
});
</script>

<style lang="sass" scoped></style>
