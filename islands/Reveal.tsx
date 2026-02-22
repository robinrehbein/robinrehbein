import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { cn } from "../lib/utils.ts";
import { ComponentChildren } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

const Reveal = ({ children }: { children: ComponentChildren }) => {
  const isVisible = useSignal(false);

  useEffect(() => {
    if (!IS_BROWSER) return;
    const handleScroll = () => {
      if (globalThis.scrollY > globalThis.innerHeight * 0.5) {
        isVisible.value = true;
      } else {
        isVisible.value = false;
      }
    };
    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  if (!IS_BROWSER) return <div>{children}</div>;
  return (
    <div
      className={cn(
        "w-0 whitespace-nowrap transition-all duration-300 overflow-hidden opacity-0",
        {
          "w-full transition-all duration-300 opacity-100": isVisible.value,
        },
      )}
    >
      {children}
    </div>
  );
};

export default Reveal;
