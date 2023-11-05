import { IMessage } from "$store/components/personal-shopper/types.ts";
import { ChangeEvent } from "https://esm.sh/v128/preact@10.15.1/compat/src/index.js";
import { useEffect, useState } from "preact/hooks";

export interface Props {
  messages: IMessage[] | null;
  handleSendMessage: (msg: string) => void;
  user: "seller" | "client";
}

const Chat = ({ messages, handleSendMessage, user }: Props) => {
  const [inputMessage, setInputMessage] = useState("second");

  useEffect(() => {
    console.log("MESSAGE NO SELLER", messages);
  }, [messages]);
  return (
    <div>
      <div>
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) =>
            setInputMessage((e.target as HTMLInputElement).value)}
        />
        <button
          onClick={() =>
            handleSendMessage(/* inputMessage */ `from ${user} message`)}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
