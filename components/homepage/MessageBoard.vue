<template lang="pug">
section.github__messageboard
  LazyHomepageTheGiscus 
</template>
<script setup lang="ts">
// @ts-ignore
// import Giscus from '@giscus/vue'
//出處：
//https://giscus.app/zh-TW
const colorMode = useColorMode()
// @ts-ignore
const theme = computed(() => `${colorMode.value}_protanopia`)
</script>

<style lang="sass" scoped>
.github__messageboard
  padding: 15px
  max-width: 800px
  width: 100%
  margin: 0 auto 60px auto
</style>
