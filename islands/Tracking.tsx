import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "fresh/runtime";

// Umami Tracking Settings
// Replace with your own Umami Website ID and Script URL
const UMAMI_WEBSITE_ID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
const UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

const Tracking = () => {
  useEffect(() => {
    if (!IS_BROWSER) return;

    const initTracking = () => {
      const consent = localStorage.getItem("cookie-consent");
      if (consent !== "accepted") return;

      // Check if already initialized
      if (document.querySelector(`script[src="${UMAMI_SCRIPT_URL}"]`)) return;

      // Umami initialization
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = UMAMI_SCRIPT_URL;
      script.setAttribute("data-website-id", UMAMI_WEBSITE_ID);
      // Umami automatically tracks page views, including SPAs, if not configured otherwise.
      // We can also add data-auto-track="true" (default)
      document.head.appendChild(script);

      console.log("Umami tracking initialized");
    };

    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail === "accepted") {
        initTracking();
      }
    };

    globalThis.addEventListener("cookie-consent-updated", handleConsentUpdate);

    // Note: Umami automatically tracks history changes (popstate/pushstate)
    // so we don't necessarily need a custom handleRouteChange like for Gtag
    // unless we want to send custom events or manual page views.

    initTracking();

    return () => {
      globalThis.removeEventListener(
        "cookie-consent-updated",
        handleConsentUpdate,
      );
    };
  }, []);

  return null;
};

export default Tracking;
