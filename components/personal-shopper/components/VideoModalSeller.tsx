import { MutableRef, Ref, useState } from "preact/hooks";
import SellerUtils from "$store/components/personal-shopper/utils/SellerUtils.ts";
import { Suspense } from "preact/compat";
import IconVideoOff from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/video-off.tsx";
import IconVideo from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/video.tsx";
import IconEarOff from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/ear-off.tsx";
import IconEar from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/ear.tsx";

export interface Props {
  modalOppened?: boolean;
  localStream: MediaStream | undefined;
  myVideo: Ref<HTMLVideoElement>;
  remoteVideo: Ref<HTMLVideoElement>;
  sellerUtils: MutableRef<SellerUtils | null>;
}

const VideoModalSeller = (
  { modalOppened = true, localStream, myVideo, remoteVideo, sellerUtils }:
    Props,
) => {
  const [videoOff, setVideoOff] = useState(false);
  const [audioOff, setAudioOff] = useState(false);

  return (
    <div class={`${modalOppened ? "block" : "hidden"} p-4`}>
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
              sellerUtils?.current?.closeCamera(localStream);
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
              sellerUtils.current?.muteAudio(localStream);
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

export default VideoModalSeller;
