import { IMessage } from "$store/components/personal-shopper/types.ts";

import { useEffect, useRef, useState } from "preact/hooks";
import Icon from "$store/components/ui/Icon.tsx";

export interface Props {
  messages: IMessage[] | null;
  handleSendMessage: (msg: string) => void;
  user: "seller" | "client";
}

const Chat = ({ messages, handleSendMessage, user }: Props) => {
  const [inputMessage, setInputMessage] = useState("");

  const messagesBlock = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("MESSAGE NO SELLER", messages);
  }, [messages]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (inputMessage) {
      handleSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (!messagesBlock.current) return;
    console.log("Chat.tsx -> messagesBlock.current", messagesBlock.current);

    messagesBlock.current.scrollTo({
      top: messagesBlock.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className={`flex flex-col relative bg-white justify-between shadow w-full ${
        user === "seller" ? "py-4 px-3 max-w-full" : "max-w-[420px] mb-5"
      }`}
    >
      <div
        className={`flex flex-col w-full h-[325px] data-[hidden=true]:hidden`}
      >
        <div
          className="grow max-h-[275px] border overflow-y-scroll"
          ref={messagesBlock}
        >
          {messages && messages?.map((msg) => {
            const prefix = msg.side === user
              ? "Eu: "
              : (user === "seller" ? "Cliente: " : "Fashion: ");
            return (
              <div
                className={`p-2 m-1 border rounded-full text-white px-3 ${
                  msg.side === user
                    ? "rounded-br-none bg-secondary"
                    : "rounded-bl-none bg-primary"
                }`}
              >
                <p className="break-words">
                  {`${prefix}${msg.message}`}
                </p>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-full"
        >
          <div class="border p-2 flex w-full items-center justify-between gap-3">
            <input
              type="text"
              value={inputMessage}
              className="outline-none h-[40px] border border-slate-500 pl-3 w-full"
              onChange={(e) =>
                setInputMessage((e.target as HTMLInputElement).value)}
              placeholder="Mensagem..."
            />
            <button
              type="submit"
              className="h-[40px] bg-secondary text-white text-xs px-4 uppercase"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>

      {
        /* {user === 'client' && (
        <button
          className={`absolute left-0 -top-6 rounded-full bg-white shadow-md p-1 m-1`}
          onClick={handleClickHiddenChat}
        >
          <Icon
            id="mini_chat"
            height={24}
            width={24}
          />
        </button>
      )} */
      }
    </div>
  );
};

export default Chat;
