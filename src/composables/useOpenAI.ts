import { MessageI } from "@/composables/useChat";

const OPENAI_API_KEY = "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";

export default () => {
  const chatSettings = reactive({
    temperature: 0.5,
    max_tokens: 256,
    model: "gpt-3.5-turbo",
  });

  const getAnswer = async (messages: MessageI[]) => {
    const answer = ref("");
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY,
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

    return answer;
  };

  return { getAnswer, chatSettings };
};
