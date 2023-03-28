export interface MessageI {
  role: "user" | "system" | "assistant";
  content: Ref<string>;
}

interface JsonMessageI {
  role: "user" | "system" | "assistant";
  content: string;
}

interface ChatI {
  created: number;
  messages: MessageI[];
  prefix: string;
  loading: boolean;
}

interface JsonChatI {
  created: number;
  messages: JsonMessageI[];
  prefix: string;
}

const DEFAULT_CHAT_PREFIX = `
I am a senior programmer, and always eager to use the newest technologies.
If you have any coding problems, please feel free to ask.
I will try my best to help you.
To keep our conversations fast and productive, I will keep my responses short. If you ask me to update some code, I will only return the changes I made, not the entire file.
`;

const chats = reactive({} as { [key: string]: ChatI });

let chatsLoaded = false;

const getLastId = () => {
  const chatKeys = Object.keys(chats).map((k) => +k);
  if (chatKeys.length === 0) return 1;
  return Math.max(...chatKeys);
};

const cleanChat = (chat: ChatI): JsonChatI => {
  return {
    created: chat.created,
    prefix: chat.prefix,
    messages: chat.messages.map((m) => ({
      role: m.role,
      content: m.content.value,
    })),
  };
};

export default async (
  id: number | "new" = 0,
  prefix: string = DEFAULT_CHAT_PREFIX
) => {
  const chat: ChatI = reactive({
    created: Date.now(),
    messages: [
      {
        role: "system",
        content: ref(prefix),
      },
    ],
    prefix,
    loading: ref(false),
  });
  const submit = async (content: string) => {
    chat.messages.push({
      role: "user",
      content: ref(content),
    });
    const { getAnswer } = useOpenAI();
    chat.loading = true;
    const { answer, done } = await getAnswer(chat.messages);
    chat.loading = false;

    chat.messages.push({ role: "assistant", content: answer });
    watch(done, (d) => {
      if (d) {
        const { set } = useIDB("codeHelper");
        chats[id.toString()] = cleanChat(chat);
        set("chats", chats);
      }
    });
  };
  if (typeof window === "undefined") return { chat: null, submit };
  const { get, set } = useIDB("codeHelper");

  if (!chatsLoaded) {
    try {
      Object.assign(chats, JSON.parse(await get("chats")));
    } catch (error) {
      console.info(error);
    }
  }
  if (id === "new") {
    id = getLastId() + 1;
  } else if (!id) {
    // if id == 0 or null, get the last chat
    id = getLastId();
  }

  if (Object.keys(chats).includes(id.toString())) {
    console.log(chats[id.toString()]);
    Object.assign(chat, chats[id.toString()]);
  } else {
    chats[id.toString()] = chat;

    set("chats", chats);
    console.log(chats);
  }

  return { chat, submit };
};
