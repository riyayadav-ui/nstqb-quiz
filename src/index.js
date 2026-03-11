import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Storage polyfill — uses localStorage when running outside Claude.ai
if (!window.storage) {
  window.storage = {
    get: async (key, shared) => {
      try {
        const v = localStorage.getItem((shared ? "shared_" : "") + key);
        return v ? { key, value: v, shared: !!shared } : null;
      } catch { return null; }
    },
    set: async (key, value, shared) => {
      try {
        localStorage.setItem((shared ? "shared_" : "") + key, value);
        return { key, value, shared: !!shared };
      } catch { return null; }
    },
    delete: async (key, shared) => {
      try {
        localStorage.removeItem((shared ? "shared_" : "") + key);
        return { key, deleted: true };
      } catch { return null; }
    },
    list: async (prefix, shared) => {
      try {
        const p = (shared ? "shared_" : "") + (prefix || "");
        const keys = Object.keys(localStorage).filter(k => k.startsWith(p));
        return { keys };
      } catch { return { keys: [] }; }
    }
  };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
