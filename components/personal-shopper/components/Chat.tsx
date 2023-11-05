import { IMessage } from "$store/components/personal-shopper/types.ts";

import { useEffect, useState } from "preact/hooks";

export interface Props {
  messages: IMessage[] | null;
  handleSendMessage: (msg: string) => void;
  user: "seller" | "client";
}

const Chat = ({ messages, handleSendMessage, user }: Props) => {
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    console.log("MESSAGE NO SELLER", messages);
  }, [messages]);
  return (
    <div class="flex flex-col h-[325px] bg-white justify-between">
      <div class="grow max-h-[275px] border overflow-y-scroll">
        {messages && messages?.map((msg) => {
          const prefix = msg.side === user
            ? "Eu: "
            : (user === "seller" ? "Cliente: " : "Fashion: ");
          return (
            <div
              class={`p-2 m-1 border rounded-full text-white ${
                msg.side === user
                  ? "rounded-br-none bg-secondary"
                  : "rounded-bl-none bg-primary"
              }`}
            >
              <p>
                {`${prefix}${msg.message}`}
              </p>
            </div>
          );
        })}
      </div>
      <div class="border p-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) =>
            setInputMessage((e.target as HTMLInputElement).value)}
          placeholder="Mensagem..."
        />
        <button
          onClick={() => inputMessage &&
            handleSendMessage(inputMessage)}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
