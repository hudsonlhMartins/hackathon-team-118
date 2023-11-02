import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { lazy, Suspense } from "preact/compat";
import ClientUtils from "../utils/ClientUtils.ts";
import { UserProfile } from "$store/components/personal-shopper/utils/utils.ts";
import { Product, UserInfo } from "$store/components/personal-shopper/types.ts";

const IconVideoOff = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/video-off.tsx"
  )
);
const IconVideo = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/video.tsx"
  )
);

const IconEarOff = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/ear-off.tsx"
  )
);
const IconEar = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/ear.tsx"
  )
);

export interface Props {
  userProfile: UserProfile;
  modalOpened: boolean;
  product: Product;
}

const VideoModal = ({ userProfile, modalOpened, product }: Props) => {
  const [audioOff, setAudioOff] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream>();

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  //TODO: leave call com connectionRef.current.destroy()
  // const connectionRef= useRef<any>(null)

  const { categoryId, productId, productName, link } = product;

  const clientUtils = useMemo(() => new ClientUtils(), []);

  useEffect(() => {
    if (!clientUtils) return;

    const initializeCall = async () => {
      if (clientUtils.webSocket.readyState !== 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        initializeCall();
        return;
      }
      await clientUtils.sendUsername(
        userProfile.Email,
        { categoryId, productId, productName, link } as Product,
        userProfile as UserInfo
      );
      clientUtils.startCall(setLocalStream, myVideo, remoteVideo);
    };
    initializeCall();
  }, [clientUtils, clientUtils.webSocket.readyState]);

  return (
    <div class={`${modalOpened ? "block" : "hidden"} mb-5`}>
      <div id="video-call-div" class="relative">
        <video
          ref={myVideo}
          muted
          id="local-video"
          autoPlay
          class="bg-black max-h-20 absolute rounded-full bottom-0 right-0 border-2 border-white"
        >
        </video>
        <video
          ref={remoteVideo}
          id="remote-video"
          autoPlay
          class="bg-black max-h-64 "
        >
        </video>
        <div class="call-action-div">
          <button
            onClick={() => {
              setVideoOff((prev) => !prev);
              clientUtils.closeCamera(localStream);
            }}
            class={`rounded-full ${
              videoOff ? "bg-red-400" : "bg-white"
            } shadow-md p-1 m-1`}
          >
            {videoOff
              ? (
                <Suspense fallback={<></>}>
                  <IconVideoOff />
                </Suspense>
              )
              : (
                <Suspense fallback={<></>}>
                  <IconVideo />
                </Suspense>
              )}
          </button>
          <button
            onClick={() => {
              setAudioOff((prev) => !prev);
              clientUtils.muteAudio(localStream);
            }}
            class={`rounded-full ${
              audioOff ? "bg-red-400" : "bg-white"
            } shadow-md p-1 m-1`}
          >
            {audioOff
              ? (
                <Suspense fallback={<></>}>
                  <IconEarOff />
                </Suspense>
              )
              : (
                <Suspense fallback={<></>}>
                  <IconEar />
                </Suspense>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
