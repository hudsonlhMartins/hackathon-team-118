import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import SellerUtils from "../utils/SellerUtils.ts";
import { Contact, IMessage } from "$store/components/personal-shopper/types.ts";
import ContactCard from "$store/components/personal-shopper/components/ContactCard.tsx";
import {
  checkAuth,
  checkSeller,
} from "$store/components/personal-shopper/utils/utils.ts";
import Spinner from "$store/components/ui/Spinner.tsx";
import { lazy, Suspense } from "preact/compat";
import Chat from "$store/components/personal-shopper/components/Chat.tsx";
import IconCoffee from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/coffee.tsx";

const VideoModalSeller = lazy(() =>
  import(
    "$store/islands/VideoModalSeller.tsx"
  )
);

export interface Props {}
const SellerPShopperStream = () => {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const sellerUtils = useRef<SellerUtils | null>(null);

  const handleJoin = async () => {
    await sellerUtils?.current?.setUsername(
      contact?.userInfo?.Email ?? "",
    );
    sellerUtils?.current?.joinCall(
      remoteVideo,
    );
  };

  const handeMessage = (message: string) => {
    sellerUtils.current?.sendChatMessage(message);
  };

  useEffect(() => {
    const checkSellerAuth = async () => {
      const authData = await checkAuth();

      const authEmail = authData?.profileData?.Email;

      const { isSeller, sellerCategories } = await checkSeller(authEmail);

      if (!isSeller) {
        window.location.pathname = "/";
        return;
      }
      setShowContent(true);

      sellerUtils.current = new SellerUtils(
        setContact,
        setMessages,
        authEmail as string,
        sellerCategories,
      );
    };
    checkSellerAuth();
  }, [sellerUtils]);

  if (!showContent) {
    return (
      <div class="fixed top-[20%] left-[50%] translate-x-[-50%]">
        <Spinner />
      </div>
    );
  }

  return (
    <div class="flex flex-col border rounded-md p-6 my-10 flex-wrap max-w-[880px] sm:p-1">
      {contact
        ? (
          <>
            <div className={`flex gap-6 w-full flex-wrap`}>
              <ContactCard contact={contact} handleJoin={handleJoin} />
              <Suspense fallback={<></>}>
                <VideoModalSeller
                  localStream={localStream}
                  remoteVideo={remoteVideo}
                  myVideo={myVideo}
                  sellerUtils={sellerUtils}
                  setContact={setContact}
                  contact={contact}
                  setLocalStream={setLocalStream}
                />
              </Suspense>
            </div>
            <Chat
              messages={messages}
              handleSendMessage={handeMessage}
              user="seller"
            />
          </>
        )
        : (
          <div class="flex flex-col items-center justify-center">
            <h1 class="text-xl font-semibold py-2 px-4">
              Não há contato no momento
            </h1>
            <IconCoffee class="w-20 h-20 text-gray-300 m-4" />
          </div>
        )}
    </div>
  );
};

export default SellerPShopperStream;
