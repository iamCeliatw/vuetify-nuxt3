<template lang="pug">
  Giscus(
      id="comments"
      repo="iamCeliatw/vuetify-nuxt3"
      repoId="R_kgDOLnHWQQ"
      category="Announcements"
      categoryId="DIC_kwDOLnHWQc4Cet3_"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      :theme="theme"
      lang="zh-TW"
      loading="lazy")
</template>
<script setup lang="ts">
import Giscus from '@giscus/vue'
//colorMode 之後做swith theme 的時候要改成動態
const colorMode = ref('light')
const theme = computed(() => `${colorMode.value}_protanopia`)
</script>