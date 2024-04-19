<template lang='pug'>
.alert__popup(v-if="visable")
  v-alert(
    closable
    v-model="visable"
    :title="title"
    :text="text"
    :type="type"
    class="alert__padding"
    )
</template>

<script lang='ts' setup>
const props = defineProps({
  visable: Boolean,
  title: String,
  text: String,
  type: String,
})

</script>

<style lang='sass' scoped>
.alert__popup
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  z-index: 1000000
  // height: 300px
  // backdrop-filter: blur(5px)
  // width: 100%
  // height: 100%
.alert__padding
  padding: 45px 10px
</style>