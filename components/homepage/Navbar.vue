<template lang="pug">
nav.navbar__wrapper 
  .navbar__container
    ul.navigate__section
      li(v-for="nav in navigate" :key="nav", @click="redirect(nav.url)") {{ nav.name }}
    .button__section 
      .github__icon 
        img(src="/github.png")
      HomepageLightModeButton
        //- HomepageSvgSunIcon
</template>

<script lang="ts" setup>
const navigate = ref([
{ name: 'Home', url: '/' },
{ name: 'About', url: '/about' },
])
const redirect = (url: string) => {
  console.log(url, 'url');
}
</script>

<style lang="sass" scoped>
.navbar__wrapper
  width: 100%
  max-width: 800px
  height: 90px
  display: flex
  justify-content: center
  margin: 0 auto
.navbar__container
  padding: 0 20px
  display: flex
  width: 100%
  height: 100%
  justify-content: space-between
  align-items: center
.navigate__section
  // flex: 2
  display: flex
  list-style-type: none
  li
    margin-right: 20px
    font-weight: 500
    font-size: 20px
    // color: var(--text-color)
.button__section
  // flex: 1
  display: flex
  align-items: center
  gap: 10px
.github__icon
  width: 30px
  height: 30px
  border-radius: 50%
  img
    width: 100%
    height: 100%
    object-fit: cover
</style>
