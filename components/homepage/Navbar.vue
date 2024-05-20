<template lang="pug">
nav.navbar__wrapper 
  .navbar__container
    ul.navigate__section
      li(v-for="nav in navigate" :key="nav", @click="() => router.push(nav.url)") {{ nav.name }}
    .button__section 
      .github__icon 
        img(src="/github.png")
      HomepageLightModeButton
        //- HomepageSvgSunIcon
</template>

<script lang="ts" setup>

const router = useRouter()
const navigate = ref([
{ name: '文章', url: '/' },
{ name: '關於我', url: '/about' },
{ name: '分類', url:'/category'}
])
const redirect = (url: string) => {
  console.log(url, 'url');
}
</script>

<style lang="sass" scoped>
@import "../../assets/breakpoint"

.navbar__wrapper
  width: 65%
  height: 90px
  display: flex
  justify-content: center
  margin: 0 auto
  @include breakPoint(size-768 ,null)
    width: 90%
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
    cursor: pointer
    height: 40px
    line-height: 40px
    &:hover
      border-bottom: 2px solid 
      border-color: #ebf4f1
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
