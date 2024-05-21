<template lang='pug'>
QuillEditor(theme="snow",
  @update:content="setValue()",
  ref="quillEditor",
  v-model:content="content"
  contentType="html",
  :options="data.editorOption"
  )
</template>

<script setup>
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import "quill/dist/quill.snow.css";
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css'; 
import { indexStore } from "../../store/index"

const props = defineProps({
  modelValue: String,
  content: String
})
const store = indexStore();
// watch(() => store.selectedImage, (value) => {
//   if(value && quillEditor.value){
//     quillEditor.value.getQuill().clipboard.dangerouslyPasteHTML(0, `<img src="${store.selectedImage.image}" alt="${store.selectedImage.name}" />`);
//   }
// }, { immediate: true });





const content = ref(props.modelValue || '') // 初始化內容或者使用 props 的 modelValue
const quillEditor = ref(null)
const emit = defineEmits(['update:modelValue', 'updateValue']);
watch(() => store.selectedImage, (newValue, oldValue) => {
  if (newValue && quillEditor.value) {
    let quill = quillEditor.value.getQuill();
    let length = quill.getLength();
    console.log(newValue, oldValue, length);

    // 插入圖片
    quill.insertEmbed(length, 'image', newValue.image);
    let fileName = newValue.name.substring(0, newValue.name.lastIndexOf('.'));

    // 查找剛插入的圖片並設置 alt 屬性
    let delta = quill.getContents();
    let ops = delta.ops;
    for (let i = 0; i < ops.length; i++) {
      if (ops[i].insert && ops[i].insert.image === newValue.image) {
        quill.formatText(i, 1, 'alt', fileName);
        break;
      }
    }
  }
});


const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'align': [] }],
  ['video'],
  ['link'],['code-block'],['blockquote'],
]

const QuillEditor = defineAsyncComponent(() => import('@vueup/vue-quill').then(module => module.QuillEditor));

const data = reactive({
  content: '',
  editorOption: {
    modules: {
      syntax: true,
      toolbar: {
        container:
          toolbarOptions,
      }
    },
    placeholder: '請輸入內容...'
  }
})
window.hljs = hljs;

//為防止server端渲染時，找不到window對象，所以需要在client端渲染
const setValue = async() => {
  await nextTick()
  emit('update:modelValue', content.value)
}
watch(() => props.modelValue, (value) => {
  if(value){
    content.value = value;
  }
}, { immediate: true });


onMounted(async() => {
  await nextTick(() => {
    if(quillEditor.value){ 
      const quill = quillEditor.value.getQuill();
      const toolbar = quill.getModule('toolbar');
      const customButton = document.createElement('span');
      const imageHTML = `
        <div class="custom-button">
          <img src="/edit.png"></img>
        </div>`
      customButton.classList.add('ql-formats');
      customButton.innerHTML = imageHTML
      customButton.addEventListener('click', () => {
        store.popupHandler();
        console.log('按鈕被點擊了',store.openImagePopup);
      });
      toolbar.container.appendChild(customButton);
    }
  });
});
</script>

<style lang='sass' scoped>

</style>