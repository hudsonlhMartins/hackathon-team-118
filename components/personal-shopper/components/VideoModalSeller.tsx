import {
  MutableRef,
  Ref,
  StateUpdater,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";
import SellerUtils from "$store/components/personal-shopper/utils/SellerUtils.ts";
import { Suspense } from "preact/compat";
import IconVideoOff from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/video-off.tsx";
import IconVideo from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/video.tsx";
import IconEarOff from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/ear-off.tsx";
import IconEar from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/ear.tsx";

import IconX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/x.tsx";
import { Contact } from "$store/components/personal-shopper/types.ts";

export interface Props {
  modalOppened?: boolean;
  localStream: MediaStream | undefined;
  myVideo: Ref<HTMLVideoElement>;
  remoteVideo: Ref<HTMLVideoElement>;
  sellerUtils: MutableRef<SellerUtils | null>;
  setContact: StateUpdater<Contact | null>;
  contact:Contact | null
}

const VideoModalSeller = (
  {
    modalOppened = true,
    localStream,
    myVideo,
    remoteVideo,
    sellerUtils,
    setContact,
    contact
  }: Props,
) => {
  const [videoOff, setVideoOff] = useState(false);
  const [audioOff, setAudioOff] = useState(false);

  const refStream = useRef<MediaStream | null>(null)
  const refMyVideo =  useRef<HTMLVideoElement>(null);

  const connectionRef = useRef(sellerUtils?.current?.peerConn);

  useEffect(() => {
    
    navigator.mediaDevices.getUserMedia({
      video: {
        frameRate: 24,
        width: {
          min: 480,
          ideal: 720,
          max: 1280,
        },
        aspectRatio: 1.33333,
      },
      audio: true,
    }).then((stream)=>{
      refStream.current = stream
      refMyVideo.current!.srcObject = stream
      sellerUtils.current?.initialStream(stream)
    })
  }, [contact?.productInfo]);

  return (
    <div
      class={`${modalOppened ? "block" : "hidden"} p-4 flex flex-col items-end`}
    >
      <button
        class="rounded-full bg-red-400 shadow-md p-1 m-1"
        onClick={() => {
          setContact(null);
          sellerUtils?.current?.closeCall();
          connectionRef.current?.close();
        }}
      >
        <Suspense fallback={<></>}>
          <IconX />
        </Suspense>
      </button>
      <div id="video-call-div" class="relative">
        <video
          ref={refMyVideo}
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
