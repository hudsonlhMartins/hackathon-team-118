import { formatMessage } from "$store/components/personal-shopper/utils/utils.ts";

interface Props {
  message: string;
  prefix: string;
}

const Message = ({ message, prefix }: Props) => {
  const formatedMessage = formatMessage(prefix + message);


  return (
    <p
      className="break-words"
      dangerouslySetInnerHTML={{ __html: formatedMessage }}
    >
    </p>
  );
};

export default Message;
