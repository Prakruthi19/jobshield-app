import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const useGoogleScript = (
  clientId: string,
  callback: (response: any) => void
) => {
  useEffect(() => {
    const scriptId = "google-client-script";

    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = scriptId;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // renders hidden button (required internally) - only if element exists
      const googleBtnElement = document.getElementById("google-btn");
      if (googleBtnElement) {
        window.google.accounts.id.renderButton(
          googleBtnElement,
          { theme: "outline", size: "large" }
        );
      }
    };

    document.body.appendChild(script);
  }, [clientId, callback]);
};

export default useGoogleScript;
