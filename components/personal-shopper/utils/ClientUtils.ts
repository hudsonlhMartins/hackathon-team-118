import BaseUtils from "$store/components/personal-shopper/utils/BaseUtils.ts";
import {
  Ref,
  StateUpdater,
} from "https://esm.sh/v128/preact@10.15.1/hooks/src/index.js";
import { Product, UserInfo } from "$store/components/personal-shopper/types.ts";

export default class ClientUtils extends BaseUtils {
  userProfile: UserInfo;
  product: Product;
  setLocalStream: StateUpdater<MediaStream | undefined>;
  setContactActive: StateUpdater<{
    active: boolean;
    message: string;
  }>;
  myVideo: Ref<HTMLVideoElement>;
  remoteVideo: Ref<HTMLVideoElement>;
  constructor(
    userProfile: UserInfo,
    product: Product,
    setLocalStream: StateUpdater<MediaStream | undefined>,
    setContactActive: StateUpdater<{
      active: boolean;
      message: string;
    }>,
    myVideo: Ref<HTMLVideoElement>,
    remoteVideo: Ref<HTMLVideoElement>,
  ) {
    super();
    this.userProfile = userProfile;
    this.product = product;
    this.setLocalStream = setLocalStream;
    this.setContactActive = setContactActive;
    this.myVideo = myVideo;
    this.remoteVideo = remoteVideo;
    this._init();
  }

  async _init() {
    if (this.webSocket.readyState !== 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this._init();
      return;
    }
    await this.sendUsername(
      this.userProfile.Email,
      this.product,
      this.userProfile,
    );
    this.startCall();
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
        break;
      case "answer":
        this.peerConn.setRemoteDescription(data.answer);
        break;
      case "error":
        console.log("contact_seller_inactive");
        this.setContactActive({ active: false, message: data.message });
        break;
      case "candidate":
        this.peerConn.addIceCandidate(data.candidate);
    }
  }

  closeCall() {
    this._sendData({
      type: "leave_call",
    });
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  startCall() {
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
      this.stream = stream;
      this.setLocalStream(stream);

      if (this.myVideo.current) this.myVideo.current.srcObject = stream;

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
      if (this.remoteVideo.current) {
        this.remoteVideo.current.srcObject = e.streams[0];
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
