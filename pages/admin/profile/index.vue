<template lang="pug">
ClientOnly
  NuxtLayout
    v-row(justify="center" align="center" v-if="loading" class="mt-10")
      v-progress-circular(indeterminate :size="40")
    v-row(justify="center" align="center" class="mt-10 w-100" v-if="!loading") 
      v-card(variant="outlined" class="mx-auto w-75")
        v-card-item
          div
            div
              input.text-h6.mb-2.text-indigo(v-model="profileData[0].name" color='indigo' class="w-50" :disabled="!isEditing")
            div
              textarea.text-caption(v-model="profileData[0].about" :style="{minHeight: '100px'}"
               :disabled="!isEditing" class="w-50" ) {{ profileData[0].about }}
          v-card-actions
            v-btn(@click="editProfile") {{ isEditing ? "Save" : "Edit" }}
            v-btn(@click="cancelEdit" v-if="isEditing") {{ "cancel" }}
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useFetchApi } from "../../../composables/supabase-api";
import type { Database } from "~/types/supabase";
definePageMeta({
  colorMode: "light",
});
const supabase = useSupabaseClient();
const profileData = ref<
  Database["public"]["Tables"]["profile"]["Row"][] | null
>(null);
const { getData } = useFetchApi();
const loading = ref(false);
const isEditing = ref(false);
const dataHandler = async () => {
  loading.value = true;
  profileData.value = await getData("profile");
  loading.value = false;
};

const saveData = async () => {
  try {
    if (profileData.value) {
      const error = await supabase
        .from("profile")
        .update({
          name: profileData.value[0].name,
          about: profileData.value[0].about,
        })
        .eq("id", profileData.value[0].id);
    } else {
      console.error("No data to save");
    }
  } catch (error) {
    console.error("Failed to save data:", error.message);
  }
};
const cancelEdit = () => {
  isEditing.value = false;
};
const editProfile = async () => {
  if (isEditing.value) {
    loading.value = true;
    await saveData();
    loading.value = false;
  }
  isEditing.value = !isEditing.value;
};
onMounted(() => {
  dataHandler();
});
</script>
