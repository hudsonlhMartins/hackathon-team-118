import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import SellerUtils from "../utils/SellerUtils.ts";
import { Contact } from "$store/components/personal-shopper/types.ts";
import ContactCard from "$store/components/personal-shopper/components/ContactCard.tsx";
import {
  checkAuth,
  checkSeller,
} from "$store/components/personal-shopper/utils/utils.ts";
import Spinner from "$store/components/ui/Spinner.tsx";
import { lazy, Suspense } from "preact/compat";

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

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const sellerUtils = useRef<SellerUtils | null>(null);

  const handleJoin = async () => {
    await sellerUtils?.current?.setUsername(
      contact?.userInfo?.Email ?? "",
    );
    sellerUtils?.current?.joinCall(
      setLocalStream,
      myVideo,
      remoteVideo,
    );
  };

  useEffect(() => {
    const checkSellerAuth = async () => {
      const authData = await checkAuth();

      const authEmail = authData?.profileData?.Email;

      const { isSeller, sellerCategories } = await checkSeller(authEmail);

      console.log("SellerPShopperStream.tsx -> isSeller: asdasdasd", isSeller);

      if (!isSeller) {
        window.location.pathname = "/";
        return;
      }
      setShowContent(true);

      sellerUtils.current = new SellerUtils(setContact);

      const initializeSeller = async () => {
        if (sellerUtils?.current?.webSocket.readyState !== 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          initializeSeller();
          return;
        }
        await sellerUtils?.current?.sendSellerName(
          authEmail as string,
          sellerCategories,
        );
      };
      initializeSeller();
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
    <div
      class={`flex border rounded-md p-6 m-10`}
    >
      {contact
        ? (
          <>
            <ContactCard contact={contact} handleJoin={handleJoin} />

            <Suspense fallback={<></>}>
              <VideoModalSeller
                localStream={localStream}
                remoteVideo={remoteVideo}
                myVideo={myVideo}
                sellerUtils={sellerUtils}
                setContact={setContact}
              />
            </Suspense>
          </>
        )
        : (
          <div>
            <h1 class="text-xl font-semibold">Não houve contato</h1>
          </div>
        )}
    </div>
  );
};

export default SellerPShopperStream;
