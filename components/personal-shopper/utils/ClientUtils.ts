import BaseUtils from "$store/components/personal-shopper/utils/BaseUtils.ts";
import {
  Ref,
  StateUpdater,
} from "https://esm.sh/v128/preact@10.15.1/hooks/src/index.js";
import { Product, UserInfo } from "$store/components/personal-shopper/types.ts";

export default class ClientUtils extends BaseUtils {
  constructor() {
    super();
  }

  sendUsername(userName: string, product: Product, userInfo: UserInfo) {
    return new Promise<void>((resolve) => {
      this.userName = userName;
      this._sendData({
        type: "store_user",
        product,
        userInfo,
      });
      resolve();
    });
  }

  protected _handleSignallingData(data: any) {
    switch (data.type) {
      case "contact":
        console.log("AAAAAAA");
        break;
      case "answer":
        this.peerConn.setRemoteDescription(data.answer);
        break;
      case "candidate":
        this.peerConn.addIceCandidate(data.candidate);
    }
  }

  closeCall() {
    this._sendData({
      type: "leave_call",
    });
  }

  startCall(
    setLocalStream: StateUpdater<MediaStream | undefined>,
    myVideo: Ref<HTMLVideoElement>,
    remoteVideo: Ref<HTMLVideoElement>,
  ) {
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
    }).then((stream) => {
      setLocalStream(stream);
      if (myVideo.current) myVideo.current.srcObject = stream;

      stream.getTracks().forEach((track) => {
        this.peerConn.addTrack(track, stream);
      });

      this.peerConn.onicecandidate = async (e: any) => {
        if (e.candidate == null) {
          return;
        }
        this._sendData({
          type: "store_candidate",
          candidate: e.candidate,
        });
      };

      this._createAndSendOffer();
    });
    // quando alguem conectar e adcionar um stream, o mesmo será exibido no video
    this.peerConn.ontrack = (e) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = e.streams[0];
      }
    };
  }
  private _createAndSendOffer() {
    // quando a oferta é criada o peerconection começa a colher icecandidates
    // esses icecandidates precisam ser enviados para o server que por sua vez enviará para a pessoa que esta tentando conectar
    this.peerConn.createOffer((offer) => {
      this._sendData({
        type: "store_offer",
        offer: offer,
      });

      this.peerConn.setLocalDescription(offer);
    }, (error) => {
      console.log(error);
    });
  }
}
