import { useEffect } from "preact/hooks";
import { createElement } from "preact";
import { useSignal } from "@preact/signals";
import { cn } from "../lib/utils.ts";
import { ComponentChildren } from "https://esm.sh/v128/preact@10.22.0/src/index.d.ts";

const Reveal = ({ children }: { children: ComponentChildren }) => {
  const isVisible = useSignal(false);
  useEffect(() => {
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
  return (createElement("div", {
    className: cn(
      "w-0 whitespace-nowrap transition-all duration-300 overflow-hidden opacity-0",
      {
        "block w-full transition-all duration-300 opacity-100": isVisible.value,
      },
    ),
  }, children));
};

export default Reveal;
