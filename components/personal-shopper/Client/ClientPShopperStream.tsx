import { useEffect, useState } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import {
  checkAuth,
  UserProfile,
} from "$store/components/personal-shopper/utils/utils.ts";
import { lazy, memo, Suspense } from "preact/compat";
import Spinner from "$store/components/ui/Spinner.tsx";
import useCategorySeller from "../hooks/useCategorySeller.ts";
import useProduct from "$store/components/personal-shopper/hooks/useProduct.tsx";


const VideoModal = lazy(() =>
  import(
    "$store/islands/VideoModal.tsx"
  )
);

export interface Props {
  productId: string;
}

const ClientPShopperStream = ({ productId }: Props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>();
  const [btnLoading, setBtnLoading] = useState(false);
  //TODO: ajustar re-render
  const prod = useProduct(productId);
  const { hasSeller, loading } =  useCategorySeller(productId);


  const handleClick = async () => {
    if (modalOpened) {
      setModalOpened(false);
      return;
    }
    if (!isAuth) {
      setBtnLoading(true);
      const { auth, profileData } = await checkAuth() as {
        auth: boolean;
        profileData: UserProfile;
      };

      if (!auth) {
        window.location.pathname = "/login";
      }
      setIsAuth(auth);
      setUserProfile(profileData);
    }
    setModalOpened(true);
    setBtnLoading(false);
  };

  useEffect(() => {
   
  }, [prod]);


  console.log("hasSeller", hasSeller);

  return (
    <>
      {hasSeller
        ? (
          <div class="fixed bottom-[5%] right-[5%] z-50 flex flex-col items-end">
            {isAuth && userProfile && prod.data
              ? (
                <Suspense fallback={<Spinner />}>
                  <VideoModal
                    userProfile={userProfile}
                    modalOpened={modalOpened}
                    product={prod.data}
                  />
                </Suspense>
              )
              : <></>}
            <Button
              class={`shadow-xl w-40 ${!modalOpened ? "animate-pulse" : ""}`}
              loading={btnLoading}
              onClick={handleClick}
            >
              Video call a seller
            </Button>
          </div>
        )
        : <></>}
    </>
  );
};

export default ClientPShopperStream;
