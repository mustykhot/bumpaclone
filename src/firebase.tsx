// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
2;
// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAWFPOQDA9SVXS1TGZEI3DUf5fZ7h5okf0",
//   authDomain: "notification-785a9.firebaseapp.com",
//   projectId: "notification-785a9",
//   storageBucket: "notification-785a9.appspot.com",
//   messagingSenderId: "367055059577",
//   appId: "1:367055059577:web:68368356a476fc25ccf2a8",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBrdmQbw67Lp9QARhtN2asFQ4SidOJq-6s",
  authDomain: "salescabal-mobile.firebaseapp.com",
  // databaseURL: “https://salescabal-mobile.firebaseio.com”,
  projectId: "salescabal-mobile",
  storageBucket: "salescabal-mobile.appspot.com",
  messagingSenderId: "484403892265",
  appId: "1:484403892265:web:5f2ee370f779b9d2280c38",
  measurementId: "G-YHHSFQ92TQ",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getTokenFnc = () => {
  return getToken(messaging, {
    vapidKey:
      "BPr4BKCHPyE8wszjHqtdGzSfmVH-du97DDqgVftuRksBAmYa7UcqPtl7aEd_Zu_cshLTruMadph-y0GlbQSaaa0",
  })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
      } else {
        return "";
      }
    })
    .catch((err: any) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
