import { useEffect, useRef, useState } from "preact/hooks";
import SellerUtils from "../utils/SellerUtils.ts";

let sellerUtils: SellerUtils;

export interface Props {}
const SellerPShopperStream = () => {
  const [videoOff, setVideoOff] = useState(false);
  const [audioOff, setAudioOff] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream>();

  const myVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
  //TODO: leave call com connectionRef.current.destroy()
  // const connectionRef= useRef<any>(null)

  useEffect(() => {
    sellerUtils = new SellerUtils();
  }, []);

  return (
    <div>
      <div>
        <input
          placeholder="Enter username..."
          type="text"
          ref={refInput}
          id="username-input"
          value={inputUsername}
          onChange={(e) =>
            setInputUsername((e?.target as HTMLInputElement)?.value)}
        />
        <br />
        <button
          onClick={() => {
            sellerUtils.setUsername(inputUsername ?? refInput?.current?.value);
            sellerUtils.joinCall(setLocalStream, myVideo, remoteVideo);
          }}
        >
          Join Call
        </button>
      </div>
      <div id="video-call-div">
        <video ref={myVideo} muted id="local-video" autoPlay></video>
        <video ref={remoteVideo} id="remote-video" autoPlay></video>
        <div class="call-action-div">
          <button
            onClick={() => {
              setVideoOff((prev) => !prev);
              sellerUtils.closeCamera(localStream);
            }}
          >
            Close Camera
          </button>
          <button
            onClick={() => {
              setAudioOff((prev) => !prev);
              sellerUtils.muteAudio(localStream);
            }}
          >
            Mute Audio
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerPShopperStream;
