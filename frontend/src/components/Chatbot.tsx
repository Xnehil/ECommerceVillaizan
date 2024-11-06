"use client";

declare global {
  interface Window {
    voiceflow: any; // Adjust the type as needed
  }
}

const Chatbot: React.FC = () => {
  if (typeof window === "undefined") {
    return null; // Return null if running on the server
  }

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
  script.onload = function() {
    window.voiceflow.chat.load({
        verify: { projectID: '672a943a3c8f1d73c0a5c6e4' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        launch: {
          event: {
            type: 'launch',
            payload: {
              baseUrl: process.env.NEXT_PUBLIC_CHATBOT_BACKEND_URL || "https://back.heladosvillaizan.tech",
              frontUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000",
            }
          }
        }
      });
  };
  document.body.appendChild(script);

  return null;
};

export default Chatbot;