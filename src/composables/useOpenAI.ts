import { MessageI } from "@/composables/useChat";

export default () => {
  const chatSettings = reactive({
    temperature: 0.5,
    max_tokens: 256,
    model: "gpt-3.5-turbo",
  });
  const getAnswer = async (messages: MessageI[]) => {
    const answer = ref("");
    const done = ref(false);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + "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",
      },
      method: "POST",
      body: JSON.stringify({
        messages,
        stream: true,
        ...chatSettings,
      }),
    });

    const reader = res.body?.pipeThrough(new TextDecoderStream()).getReader();

    const getChunks = (data: string) => {
      const chunks = data.split("\n");
      const newChunks = [];
      for (let chunk of chunks) {
        if (chunk.startsWith("data: ")) {
          try {
            const newData = JSON.parse(chunk.replace("data: ", ""));
            if (newData) {
              newChunks.push(newData);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }

      return newChunks;
    };
    const interval = setInterval(async () => {
      const re = await reader?.read();
      if (re?.done) {
        clearInterval(interval);
      }
      try {
        if (!re?.value) return;
        const newChunks = getChunks(re?.value);
        for (let chunk of newChunks) {
          console.log(chunk);
          if (chunk.choices[0].delta?.content) {
            answer.value = answer.value + chunk.choices[0].delta.content;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, 10);

    return { answer, done };
  };

  return { getAnswer, chatSettings };
};
