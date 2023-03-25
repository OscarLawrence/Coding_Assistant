<template>
  <div>
    <div
      v-for="row in rows"
      :style="{ 'padding-left': row.includes('\t') ? '1rem' : '0rem' }"
    >
      <CodeEditor
        v-if="row.startsWith('<CODE_')"
        :code="codeBlocks[+row.slice(6, 1)] || ''"
      />

      <p v-else>{{ row }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CodeEditor from "@/components/CodeMirror.vue";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
});

// const highlighter = (code: string) => {
//   return highlight(code, languages.js); // languages.<insert language> to return html with markup
// };

// const codeBlocks = reactive({});

const content = toRef(props, "content");

const codeBlocks = computed(() => {
  const blocks = content.value.match(/```[\s\S]*?```/g);
  //   if (blocks) {
  //     return blocks.map((block) => block.replace(/```/g, ""));
  //   }
  return blocks || [];
});

const formattedContent = computed(() => {
  let tmp_content = content.value;

  for (let i in codeBlocks.value) {
    const codeBlock = codeBlocks.value[i];
    tmp_content = tmp_content.replace(codeBlock, `<CODE_${i}>`);
  }
  return tmp_content;
});

const rows = computed(() => {
  return formattedContent.value.split("\n");
});
</script>

<style lang="scss" scoped>
p {
  margin: 0px;
  margin-bottom: 0.2rem;
}
</style>
