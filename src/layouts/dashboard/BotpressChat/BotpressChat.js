import { useEffect } from "react";

function BotpressChat() {
  useEffect(() => {
    // éviter de charger plusieurs fois
    if (!document.getElementById("botpress-script")) {
      const script = document.createElement("script");
      script.id = "botpress-script";
      script.src = "https://cdn.botpress.cloud/webchat/v3.2/inject.js";
      script.async = true;
      script.onload = () => {
        // Charger ensuite la config de ton bot
        const botScript = document.createElement("script");
        botScript.src = "https://files.bpcontent.cloud/2025/07/17/12/20250717122959-PKE73DE0.js";
        botScript.defer = true;
        document.body.appendChild(botScript);
      };
      document.body.appendChild(script);
    }
  }, []);

  return null;
}

export default BotpressChat;
