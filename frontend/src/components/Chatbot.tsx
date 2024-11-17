"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    voiceflow: any; // Adjust the type as needed
  }
}

interface ChatbotProps {
  base64Css: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ base64Css }) => {
  // Add the script and load Voiceflow widget
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";

    script.onload = function() {
      window.voiceflow.chat.load({
        verify: { projectID: '672a943a3c8f1d73c0a5c6e4' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        assistant: {
          title: 'Villabot',
          stylesheet: `data:text/css;base64,${base64Css}`,
          disableInput: true,
        },
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

    // Clean up the script when the component unmounts
    return () => {
      script.remove();
    };
  }, [base64Css]); // Effect dependency on base64Css

  return null;
};

export default Chatbot;
