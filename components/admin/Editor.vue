<template lang='pug'>
QuillEditor(theme="snow",
  @update:content="setValue()",
  v-model:content="content"
  contentType="html",
  :options="data.editorOption"
  )
p {{ content }}
</template>

<script lang='ts' setup>
import '@vueup/vue-quill/dist/vue-quill.snow.css';
const props = defineProps({
  modelValue: String,
  content: String
})

const content = ref(props.modelValue || '') // 初始化內容或者使用 props 的 modelValue

const emit = defineEmits(['update:modelValue', 'updateValue']);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['video'],
  ['link'],
]
const data = reactive({
  content: '',
  editorOption: {
    modules: {
      toolbar: {
        container:
          toolbarOptions,
      }
    },
    placeholder: '請輸入內容...'
  }
})
//為防止server端渲染時，找不到window對象，所以需要在client端渲染
const QuillEditor = defineAsyncComponent(() => import('@vueup/vue-quill').then(module => module.QuillEditor));

const setValue = async() => {
  await nextTick()
  emit('update:modelValue', content.value)
}
watch(() => props.modelValue, (value) => {
  if(value){
    content.value = value;
  }
}, { immediate: true });

</script>

<style lang='sass' scoped>
  
</style>