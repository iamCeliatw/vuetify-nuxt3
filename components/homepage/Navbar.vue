<template lang="pug">
nav.navbar__wrapper 
  .navbar__container
    .navbar__title 
      //- p Celia's note
    .button__section 
      ul.navigate__section
        li(:class="{ 'active-route': router.currentRoute.value.path === nav.url }" v-for="nav in navigate" :key="nav", @click="() => router.push(nav.url)" ) {{ nav.name }}
      //- .github__icon 
      //-   img(src="/github.png")
      .light__button
        HomepageLightModeButton
</template>

<script lang="ts" setup>
const colorMode = useColorMode();
const router = useRouter();
const navigate = ref([
  { name: "post", url: "/" },
  { name: "about", url: "/about" },
  { name: "category", url: "/category" },
]);
</script>

<style lang="sass" scoped>
@import "../../assets/breakpoint"

.navbar__wrapper
  width: auto
  max-width: 800px
  height: 90px
  display: flex
  justify-content: center
  margin: 0 auto
  @include breakPoint(size-768 ,null)
    width: 90%
  @include breakPoint(size-512 ,null)
    width: 100%
.navbar__container
  padding: 0 20px
  display: flex
  width: 100%
  height: 100%
  justify-content: space-between
  align-items: center
  @include breakPoint(size-768 ,null)
    // padding: 0 10p
.navigate__section
  display: flex
  list-style-type: none
  li
    margin-right: 20px
    font-weight: 500
    font-size: 20px
    cursor: pointer
    height: 40px
    line-height: 40px
    transition: all .2s
    &:hover
      border-bottom: 2px solid
    @include breakPoint(size-768 ,null)
      font-size: 16px
.button__section
  display: flex
  align-items: center
  gap: 10px
  @include breakPoint(size-512 ,null)
    width: 100%
    justify-content: space-between
.github__icon
  width: 30px
  height: 30px
  border-radius: 50%
  img
    width: 100%
    height: 100%
    object-fit: cover
.active-route
  border-bottom: 2px solid
.navbar__title
  p
    font-size: 26px
    @include breakPoint(size-768 ,null)
      font-size: 20px
    @include breakPoint(size-512 ,null)
      display: none

.light__button
  width: auto
</style>
