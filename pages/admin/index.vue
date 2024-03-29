<template lang="pug">
ClientOnly
  NuxtLayout
    .testt 
      h1 1123
</template>
  
<script setup lang="ts">
import { reactive, ref } from "vue";
import { useCounterStore } from "../../store/index"
const store = useCounterStore()

const email = ref('');
const password = ref('');

</script>

<style lang="sass" scoped>
.test
  color: red
</style>