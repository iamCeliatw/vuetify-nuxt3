<template lang="pug">
section.main__wrapper 
  .main__container 
    .article__container 
      h1.article__title this is a title 
      hr.article__hr
      .article__date June 1, 2021
      p.article__content 
      | Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      | Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
    .article__container 
      h1.article__title this is a title 
      hr.article__hr
      .article__date June 1, 2021
      p.article__content 
      | Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      | Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
    .article__container 
      h1.article__title this is a title 
      hr.article__hr
      .article__date June 1, 2021
      p.article__content 
      | Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      | Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
</template>

<script lang="ts" setup></script>

<style lang="sass" scoped>
.main__wrapper
  width: 1200px
  height: 100%
  margin: 60px auto
  padding: 0 20px
.main__container
  display: flex
  flex-direction: column
  gap: 50px
  width: 100%
  height: 100%
.article
  &__container
    display: flex
    flex-direction: column

  &__content
    font-size: 20px
    margin-top: 20px
</style>
