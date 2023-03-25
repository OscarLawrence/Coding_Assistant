<template>
  <div class="editorWrapper">
    <h5>{{ language }}:</h5>
    <div
      ref="editor"
      style="
        background-color: black;
        color: white;
        border-radius: 15px;
        max-width: 90vw;
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
});

const language = props.code.match(/```(\w+)/)?.[1];

console.log(language);

const extensions = [keymap.of(defaultKeymap)];
if (language) {
  try {
    import(`@codemirror/lang-${language}`).then((module) => {
      console.log(module);
      extensions.push(module.default());
    });
  } catch (error) {
    console.error(error);
  }
}

let startState = EditorState.create({
  doc: props.code.replaceAll(/```/g, "").replace(language || "", ""),
  extensions,
});

const editor = ref(null);

let view = null;

onMounted(() => {
  //   const editor = CodeMirror.fromTextArea(textareaRef.value, {
  //     mode: "javascript",
  //     theme: "material",
  //     lineNumbers: true,
  //   });
  console.log(editor.value);
  //   editor.setSize("100%", "100%");
  view = new EditorView({
    state: startState,
    parent: editor.value,
  });
});

onBeforeUnmount(() => {
  if (view) {
    view.destroy();
  }
});
</script>

<style lang="scss" scoped>
h5 {
  margin: 0;
}
</style>
