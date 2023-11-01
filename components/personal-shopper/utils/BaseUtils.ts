import { StateUpdater } from "https://esm.sh/v128/preact@10.15.1/hooks/src/index.js";

export default abstract class BaseUtils {
  userName: string | null = null;
  peerConn: RTCPeerConnection;
  webSocket: WebSocket;

  constructor() {
    const configuration: RTCConfiguration = {
      iceServers: [
        {
          "urls": [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
    };

    this.peerConn = new RTCPeerConnection(configuration);
    this.webSocket = new WebSocket("ws://localhost:3000/");
    this.webSocket.onmessage = (event) => {
      this._handleSignallingData(JSON.parse(event.data));
    };
  }

  protected abstract _handleSignallingData(data: any): void;

  protected _sendData(data: any) {
    return new Promise<void>((resolve) => {
      data.username = this.userName;
      this.webSocket.send(JSON.stringify(data));
      resolve();
    });
  }

  muteAudio(
    localStream: MediaStream | undefined,
  ) {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  }

  closeCamera(
    localStream: MediaStream | undefined,
  ) {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    }
  }
}
