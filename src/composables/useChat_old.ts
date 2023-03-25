export interface MessageI {
  role: "user" | "system" | "assistant";
  content: string;
}

interface ChatI {
  created: number;
  messages: MessageI[];
  prefix: string;
}

let chats: { [key: string]: ChatI } = {};

const getLastId = () => {
  const chatKeys = Object.keys(chats).map((k) => +k);
  if (chatKeys.length === 0) return 1;
  return Math.max(...chatKeys);
};

export default (prefix: string, id: number | "new" = 0) => {
  if (typeof window !== "undefined") {
    const { get } = useIDB("codeHelper");
    get("chats").then((data) => {
      console.log(data);
      chats = JSON.parse(data);
    });
  }

  let chat = {
    created: Date.now(),
    messages: [
      {
        role: "system",
        content: prefix,
      },
    ] as MessageI[],
    prefix,
  };
  let messages = ref([] as MessageI[]);
  if (!id) {
    id = getLastId();
  }
  if (id === "new") {
    id = getLastId() + 1;
  }

  console.log(id);
  console.log;
  if (Object.keys(chats).includes(id.toString())) {
    console.log(chats[id.toString()]);
    chat = chats[id.toString()];
  } else {
    chats[id.toString()] = chat;
    const { set } = useIDB("codeHelper");

    // set("chats", chats);
    console.log(chats);
  }

  messages.value = chat.messages;

  const userContext = ref(null);

  const loading = ref(false);

  const submit = async (content: string) => {
    messages.value.push({
      role: "user",
      content,
    });
    const { getAnswer } = useOpenAI();
    loading.value = true;
    const answer = await getAnswer(messages.value);
    loading.value = false;

    messages.value.push({ role: "assistant", content: answer.value });
    const { set } = useIDB("codeHelper");

    watch(answer, (val) => {
      const newMessages = messages.value;
      newMessages[newMessages.length - 1].content = val;
      messages.value = newMessages;
      chat.messages = messages.value;
      chats[id.toString()] = chat;
      set("chats", chats);
    });
  };

  return {
    messages,
    userContext,
    submit,
    loading,
  };
};
