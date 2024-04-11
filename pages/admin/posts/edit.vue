<template lang="pug">
ClientOnly
  NuxtLayout
    .form-wrapper.w-75.py-12.ma-auto
      form
        v-text-field(v-model="state.name" :counter="10" :error-messages="v$.name.$errors.map(e => e.$message)" label="Title" required @blur="v$.name.$touch" @input="v$.name.$touch")
        v-text-field(v-model="state.email" :error-messages="v$.email.$errors.map(e => e.$message)" label="E-mail" required @blur="v$.email.$touch" @input="v$.email.$touch")
        v-select(v-model="state.select" :error-messages="v$.select.$errors.map(e => e.$message)" :items="categoriesList" label="Item" required item-title="name" @blur="v$.select.$touch" @change="v$.select.$touch")
        Editor
        .my-4
        v-btn(class="me-4" @click="v$.$validate") submit
        v-btn(@click="clear") clear
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import type { VAlert } from 'vuetify/components';
// import QuillEditor from '../../../components/quillEditor.vue'
// import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
const supabase = useSupabaseClient()
const initialState = {
  name: '',
  email: '',
  select: null,
  items: [],
  checkbox: null,
}

const state = reactive({
  ...initialState,
})

const rules = {
  name: { required: required },
  email: { required, email },
  select: { required },
  items: { required },
  checkbox: { required },
}

const { data: categoriesList, pending, error, refresh } = useAsyncData('articles', async () => {
  const { data, error } = await supabase.from('categories').select();

  if (error) throw new Error('Failed to fetch articles');
  return JSON.parse(JSON.stringify(data));
});

const v$ = useVuelidate(rules, state)
function clear () {
  v$.value.$reset()
  for (const [key, value] of Object.entries(initialState)) {
    (state as Record<string, typeof value>)[key] = value
  }
}

</script>

<style lang='sass' scoped>

</style>