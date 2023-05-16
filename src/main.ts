import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1G6NESNDF4sDUiM3mV-PrHaDY-Vu1JUM",
  authDomain: "xc-rpc.firebaseapp.com",
  projectId: "xc-rpc",
  storageBucket: "xc-rpc.appspot.com",
  messagingSenderId: "1000175587296",
  appId: "1:1000175587296:web:7be3ef43c1d8a51b3ae585",
  measurementId: "G-K4Q4PHC899"
};

const servers = {
  iceServers: [
      {
          urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      },
  ],
  iceCandidatePoolSize: 10,
};


let localStream: MediaStream | null = null;
let remoteStream: MediaStream | null = null;
let pc = new RTCPeerConnection(servers);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <video id="localVideo" autoplay playsinline></video>
    <video id="remoteVideo" autoplay playsinline></video>
    <button id="webcamBtn" type="button">Allow webcam and microphone</button>
    <button id="callBtn" type="button">Call</button>
  </div>
`;

const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
const webcamButton = document.getElementById("webcamBtn") as HTMLButtonElement;

webcamButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    if (localStream)
      pc.addTrack(track, localStream);
  });

  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      if (remoteStream)
        remoteStream.addTrack(track);
    });
  };

  localVideo.srcObject = localStream;
    
};

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
