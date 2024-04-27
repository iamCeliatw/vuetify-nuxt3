<template lang="pug">
div.pa-4.text-center
  v-dialog(v-model="dialog" max-width="600")
    template(v-slot:activator="{ props: activatorProps }")
      v-btn(class="text-none font-weight-regular" prepend-icon="mdi-account" text="Edit Profile" variant="tonal" v-bind="activatorProps")
    v-card(prepend-icon="mdi-plus" title="Tag name")
      v-card-text
        v-row(dense)
          v-col(cols="14" md="4" sm="6")
            v-text-field(label="name*" required)
        small.text-caption.text-medium-emphasis *indicates required field
      v-divider
      v-card-actions
        v-spacer
        v-btn(text="Close" variant="plain" @click="dialog = false")
        v-btn(color="primary" text="Save" variant="tonal" @click="dialog = false")
</template>
<script setup lang="ts">
import Giscus from '@giscus/vue'
//colorMode 之後做swith theme 的時候要改成動態
const colorMode = ref('light')
const dialog = ref(false)
const theme = computed(() => `${colorMode.value}_protanopia`)
</script>