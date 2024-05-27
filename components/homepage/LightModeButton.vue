<template lang="pug">
.container
  .btn
    input(type="checkbox" name="check" id="check" @change="changeMode")
    label(for="check")
      .box
        .ball(:style="{transform: colorMode.value === 'dark' ? 'translatex(100%)' : 'translatex(0%)'}")
        .scenary
          HomepageSvgMoonIcon
          HomepageSvgSunIcon
</template>

<script lang="ts" setup>
const colorMode = useColorMode();
const changeMode = () => {
  console.log(colorMode);
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<style lang="sass" scoped>
@import "@/assets/mixin.sass"
$scale:55px
$time: 1s
.container
  display: flex
  flex-direction: column
  width: 80%
  @media (min-width:500px)
    width: 50%

input[type="checkbox"]
  display: none


.box
  @include common(flex,column,center,null,$scale,calc($scale/2),var(--box-color))
  position: relative
  border-radius: calc($scale/4)
  cursor: pointer


.ball
  @include common(null,null,null,null,calc($scale/2),calc($scale/2),grey)
  position: absolute
  border-radius: 50%
  border: 3px solid black


.scenary
  @include common(flex, row, space-between,null,null,null,null)
  padding: 2px 10px 0px 10px
  svg
    width: calc($scale / 3)
</style>
