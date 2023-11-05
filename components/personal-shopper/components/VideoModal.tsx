import { StateUpdater, useMemo, useRef, useState } from "preact/hooks";
import { lazy, Suspense } from "preact/compat";
import ClientUtils from "../utils/ClientUtils.ts";
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
const IconX = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/x.tsx"
  )
);
const IconArrowsMaximize = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrows-maximize.tsx"
  )
);
const IconArrowsMinimize = lazy(() =>
  import(
    "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrows-minimize.tsx"
  )
);

export interface Props {
  userProfile: UserInfo;
  modalOpened: boolean;
  product: Product;
  setUserProfile: StateUpdater<UserInfo | null | undefined>;
}

const VideoModal = (
  { userProfile, modalOpened, product, setUserProfile }: Props,
) => {
  const [audioOff, setAudioOff] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [videoFull, setVideoFull] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [contactActive, setContactActive] = useState({
    active: true,
    message: "",
  });

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const clientUtils = useMemo(
    () =>
      new ClientUtils(
        userProfile,
        product,
        setLocalStream,
        setContactActive,
        myVideo,
        remoteVideo,
      ),
    [],
  );

  const connectionRef = useRef(clientUtils.peerConn);

  if (!contactActive.active) return <div>{contactActive.message}</div>;
  return (
    <div
      class={`${
        modalOpened ? "block" : "hidden"
      } mb-5 flex flex-col items-end max-w-[90vw]`}
    >
      <div class="flex justify-between w-full">
        <button
          class="rounded-full bg-white shadow-md p-1 m-1"
          onClick={() => {
            setVideoFull((prev) => !prev);
          }}
        >
          {videoFull
            ? (
              <Suspense fallback={<></>}>
                <IconArrowsMinimize />
              </Suspense>
            )
            : (
              <Suspense fallback={<></>}>
                <IconArrowsMaximize />
              </Suspense>
            )}
        </button>
        <button
          class="rounded-full bg-red-400 shadow-md p-1 m-1"
          onClick={() => {
            setUserProfile(null);
            clientUtils.closeCall();
            connectionRef.current.close();
          }}
        >
          <Suspense fallback={<></>}>
            <IconX />
          </Suspense>
        </button>
      </div>
      <div id="video-call-div" class="relative max-w-full">
        <div
          class={`${
            !videoFull ? "w-20" : "w-40"
          } absolute bottom-0 right-0 transition-all`}
        >
          <video
            ref={myVideo}
            muted
            id="local-video"
            autoPlay
            class={`bg-black h-full w-full rounded-full border-2 border-white`}
          >
          </video>
        </div>
        <div class={`${!videoFull ? "w-64" : "w-[35rem]"} transition-all`}>
          <video
            ref={remoteVideo}
            id="remote-video"
            autoPlay
            class={`bg-black h-full w-full`}
          >
          </video>
        </div>
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
