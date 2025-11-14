// src/utils/provider.js
import { ethers } from "ethers";
import { VITE_INFURA_WSS_URL } from "./constants";

let wsProvider = null;

export function getWebSocketProvider() {
  // reuse existing provider if available
  if (wsProvider) return wsProvider;

  console.log("🔌 Creating single WebSocketProvider...");

  // create provider
  wsProvider = new ethers.WebSocketProvider(VITE_INFURA_WSS_URL);

  // 🧠 some versions of ethers initialize the websocket lazily,
  // so we check once connection becomes available.
  if (wsProvider._websocket) {
    attachReconnect(wsProvider);
  } else {
    // wait until websocket is created internally
    setTimeout(() => {
      if (wsProvider && wsProvider._websocket) attachReconnect(wsProvider);
    }, 1000);
  }

  return wsProvider;
}

// helper: attach reconnect listener safely
function attachReconnect(provider) {
  try {
    provider._websocket.on("close", () => {
      console.log("❌ WebSocket closed, reconnecting...");
      wsProvider = null;
      setTimeout(getWebSocketProvider, 3000);
    });
  } catch (e) {
    console.warn("⚠️ Couldn't attach reconnect handler:", e.message);
  }
}
