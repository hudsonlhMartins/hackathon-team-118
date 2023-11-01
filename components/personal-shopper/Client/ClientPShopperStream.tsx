import { useEffect, useState } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import {
  checkAuth,
  UserProfile,
} from "$store/components/personal-shopper/utils/utils.ts";
import { lazy, Suspense } from "preact/compat";
import Spinner from "$store/components/ui/Spinner.tsx";
import useCategorySeller from "$store/components/personal-shopper/hooks/useCategorySeller.tsx";
import useProduct from "$store/components/personal-shopper/hooks/useProduct.tsx";

const VideoModal = lazy(() =>
  import(
    "$store/islands/VideoModal.tsx"
  )
);

export interface Props {
  productId: string;
}

const PersonalShopperStream = ({ productId }: Props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>();
  const [btnLoading, setBtnLoading] = useState(false);
  const prod = useProduct(productId);
  const { hasSeller } = useCategorySeller(productId);

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
    console.log("PRODID", productId);
    console.log("PROD", prod);
  }, [prod]);

  return (
    <>
      {hasSeller
        ? (
          <div class="fixed bottom-[5%] right-[5%] z-50 flex flex-col items-end">
            {isAuth && userProfile
              ? (
                <Suspense fallback={<Spinner />}>
                  <VideoModal
                    userProfile={userProfile}
                    modalOpened={modalOpened}
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

export default PersonalShopperStream;
