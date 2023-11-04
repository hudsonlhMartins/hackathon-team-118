import {
  Ref,
  StateUpdater,
} from "https://esm.sh/v128/preact@10.15.1/hooks/src/index.js";
import BaseUtils from "$store/components/personal-shopper/utils/BaseUtils.ts";
import { Contact } from "$store/components/personal-shopper/types.ts";

export default class SellerUtils extends BaseUtils {
  setContact: StateUpdater<Contact | null>;
  sellerName: string | undefined;
  sellerCategories: string | undefined;
  constructor(
    setContact: StateUpdater<Contact | null>,
    sellerName: string,
    sellerCategories: string,
  ) {
    super();
    this.setContact = setContact;
    this.sellerName = sellerName;
    this.sellerCategories = sellerCategories;
    this._init();
  }

  async _init() {
    if (this.webSocket.readyState !== 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this._init();
      return;
    }
    await this.sendSellerName();
  }

  sendSellerName() {
    return new Promise<void>((resolve) => {
      this._sendData({
        type: "store_seller",
        sellerName: this.sellerName,
        categoryList: this.sellerCategories,
      });
      resolve();
    });
  }

  setUsername(userName: string) {
    return new Promise<void>((resolve) => {
      this.userName = userName;
      resolve();
    });
  }

  async closeCall() {
    await this._sendData({
      type: "leave_call",
      sellerName: this.sellerName,
    });
    window.location.reload();
  }

  _handleSignallingData(data: any) {
    switch (data.type) {
      case "offer":
        this.peerConn.setRemoteDescription(data.offer);
        this._createAndSendAnswer();
        break;
      case "answer":
        this.peerConn.setRemoteDescription(data.answer);
        break;
      case "error":
        this.setContact(null);
        alert("Cliente encerrou a conexão");
        window.location.reload();
        break;
      case "contact":
        this.setContact(data);
        console.log("data.userInfo.Email", data.userInfo.Email);
        this.userName = data.userInfo.Email;
        break;
      case "candidate":
        this.peerConn.addIceCandidate(data.candidate);
    }
  }

  private _createAndSendAnswer() {
    this.peerConn.createAnswer((answer: any) => {
      this.peerConn.setLocalDescription(answer);
      this._sendData({
        type: "send_answer",
        answer: answer,
        sellerName: this.sellerName,
      });
    }, (error: any) => {
      console.log(error);
    });
  }

  joinCall(
    setLocalStream: StateUpdater<MediaStream | undefined>,
    myVideo: Ref<HTMLVideoElement>,
    remoteVideo: Ref<HTMLVideoElement>,
  ) {
    //TODO: tirar o get media da função e colocar no on connect

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
      this.stream = stream;
      if (myVideo.current) myVideo.current.srcObject = stream;

      stream.getTracks().forEach((track) => {
        this.peerConn.addTrack(track, stream);
      });

      this.peerConn.onicecandidate = (e: any) => {
        if (e.candidate == null) {
          return;
        }

        this._sendData({
          type: "send_candidate",
          candidate: e.candidate,
        });
      };

      this._sendData({
        type: "join_call",
        sellerName: this.sellerName,
      });
    });
    // quando alguem conectar e adcionar um stream, o mesmo será exibido no video
    this.peerConn.ontrack = (e) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = e.streams[0];
      }
    };
  }
}
