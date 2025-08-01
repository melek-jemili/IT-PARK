import { useEffect } from "react";

function BotpressChat() {
  useEffect(() => {
    // Inject script uniquement si ce n'est pas déjà fait
    if (!window.botpressWebChat) {
      const script1 = document.createElement("script");
      script1.src = "https://cdn.botpress.cloud/webchat/v3.2/inject.js";
      script1.async = true;
      document.body.appendChild(script1);

      const script2 = document.createElement("script");
      script2.src = "https://files.bpcontent.cloud/2025/07/17/12/20250717122959-PKE73DE0.js"; // ton vrai lien
      script2.defer = true;
      document.body.appendChild(script2);
    }
  }, []);

  return null; // Ce composant ne rend rien visuellement
}

export default BotpressChat;
