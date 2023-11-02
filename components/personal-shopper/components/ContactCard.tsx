import { Contact } from "$store/components/personal-shopper/types.ts";
import Button from "$store/components/ui/Button.tsx";

export interface Props {
  contact: Contact | null;
  handleJoin: () => void;
}

const ContactCard = ({ contact, handleJoin }: Props) => {
  if (!contact) return <></>;
  return (
    <div class={`p-4`}>
      <>
        <h1 class="text-xl font-semibold">Novo contato!</h1>

        <div class="my-4 ">
          <ul>
            <li>
              <span class="block my-2 font-semibold">
                Nome:
              </span>
              <span class="block">
                {`${contact.userInfo.FirstName} ${contact.userInfo.LastName}`}
              </span>
            </li>
            <li>
              <span class="block my-2 font-semibold">
                Email:
              </span>
              <span class="block ">
                {`${contact.userInfo.Email}`}
              </span>
            </li>
            <li>
              <span class="block my-2 font-semibold">
                Produto:
              </span>
              <span class="block underline">
                <a target="_blank" href={contact.productInfo.link}>
                  {`${contact.productInfo.productName}`}
                </a>
              </span>
            </li>
          </ul>
        </div>
        <Button onClick={handleJoin}>
          Entrar em chamada
        </Button>
      </>
    </div>
  );
};

export default ContactCard;
