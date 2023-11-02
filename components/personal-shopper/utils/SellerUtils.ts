import {
  Ref,
  StateUpdater,
} from "https://esm.sh/v128/preact@10.15.1/hooks/src/index.js";
import BaseUtils from "$store/components/personal-shopper/utils/BaseUtils.ts";

export default class SellerUtils extends BaseUtils {
  constructor() {
    super();
  }

  setUsername(userName: string) {
    this.userName = userName;
  }

  _handleSignallingData(data: any) {
    console.log("ois");
    switch (data.type) {
      case "offer":
        this.peerConn.setRemoteDescription(data.offer);
        this._createAndSendAnswer();
        break;
      case "answer":
        this.peerConn.setRemoteDescription(data.answer);
        break;
      case "contact":
        console.log("CONTACT", data.userInfo);
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
