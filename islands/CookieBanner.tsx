import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "fresh/runtime";
import { Button } from "../components/atoms/Button.tsx";

const CookieBanner = () => {
  const isVisible = useSignal(false);

  useEffect(() => {
    if (!IS_BROWSER) return;
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      isVisible.value = true;
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    isVisible.value = false;
    // Trigger tracking initialization
    globalThis.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: "accepted" }),
    );
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    isVisible.value = false;
    globalThis.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: "declined" }),
    );
  };

  if (!isVisible.value) return null;

  return (
    <div class="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-8 bg-background border-t border-foreground shadow-2xl">
      <div class="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex-1 font-zodiak">
          <p class="text-lg mb-2 uppercase font-medium">Cookie Consent</p>
          <p class="opacity-70">
            I use cookies to improve your experience and analyze my traffic. By
            clicking "Accept", you consent to the use of all cookies.
          </p>
        </div>
        <div class="flex flex-row gap-4">
          <Button onClick={decline} class="opacity-60 hover:opacity-100">
            Decline
          </Button>
          <Button onClick={accept} class="font-bold">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
