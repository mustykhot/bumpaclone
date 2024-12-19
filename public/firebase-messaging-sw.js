// Scripts for firebase and firebase messaging

importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js"
);
// import { setShowIndicator } from "store/slice/NotificationSlice";

// import store from "store/store";

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBrdmQbw67Lp9QARhtN2asFQ4SidOJq-6s",
  authDomain: "salescabal-mobile.firebaseapp.com",
  projectId: "salescabal-mobile",
  storageBucket: "salescabal-mobile.appspot.com",
  messagingSenderId: "484403892265",
  appId: "1:484403892265:web:5f2ee370f779b9d2280c38",
  measurementId: "G-YHHSFQ92TQ",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

const pushToClient = (data) => {
  clients
    .matchAll({
      includeUncontrolled: true,
      type: "window",
    })
    .then((clients) => {
      if (clients.length > 0) {
        const windowClient = clients[0];
        // Send a message to the client.
        windowClient.postMessage({
          msg: JSON.stringify(data),
          url: windowClient.url,
        });
      }
    });
};

messaging.onBackgroundMessage(function (payload) {
  pushToClient(payload.notification);

  self.addEventListener("notificationclick", function (event) {
    const clickedNotification = event.notification;
    const action = event.action;

    if (action === "open-page") {
      if (payload.data && payload.data.order_id) {
        clients.openWindow(
          `https://app.getbumpa.com/dashboard/orders/${payload.data.order_id}`
        );
      } else if (payload.data && payload.data.product_id) {
        clients.openWindow(
          `https://app.getbumpa.com/dashboard/orders/${payload.data.product_id}`
        );
      }
    }

    clickedNotification.close();
  });

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://ik.imagekit.io/uknntomzctt/logo96_AKuzKK_aZ.png?updatedAt=1692813471944",
    badge:
      "https://ik.imagekit.io/uknntomzctt/logo48_RpNBHzox3.png?updatedAt=1692813471928",
    requireInteraction: true,
    actions: [{ action: "open-page", title: "Open Page" }],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
