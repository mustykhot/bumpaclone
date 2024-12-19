import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "store/store";
import App from "./App";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/dev-dist/sw.js")
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          // Check if installingWorker is not null
          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                // New content is available and the user will be redirected to refresh
                window.location.reload();
              } else {
                // Content is cached for offline use.
              }
            }
          };
        }
      };
    })
    .catch((error) => {
      // console.error("Error during service worker registration:", error);
    });
}
