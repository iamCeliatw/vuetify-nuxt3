<template lang="pug">
ClientOnly
  VCodeBlock(
    :code="code"
    highlightjs
    label="Hello World"
    lang="javascript"
    theme="neon-bunny"
)
</template>
<script setup lang="ts">
import Giscus from '@giscus/vue'
import { VCodeBlock } from '@wdns/vue-code-block';

const code = ref(`const foo = 'bar';`);

</script>