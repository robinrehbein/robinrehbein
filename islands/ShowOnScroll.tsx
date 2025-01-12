import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { cn } from "../lib/utils.ts";
import { ComponentChildren } from "preact";

const ShowOnScroll = (
  { children, scrollValue }: {
    children: ComponentChildren;
    scrollValue?: number;
  },
) => {
  const isVisible = useSignal(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        globalThis.scrollY > (scrollValue || (globalThis.innerHeight * 0.5))
      ) {
        isVisible.value = true;
      } else {
        isVisible.value = false;
      }
    };

    globalThis.addEventListener("scroll", handleScroll);
    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "w-0 whitespace-nowrap transition-all duration-300 overflow-hidden opacity-0",
        {
          "block w-full transition-all duration-300 opacity-100":
            isVisible.value,
        },
      )}
    >
      {children}
    </div>
  );
};

export default ShowOnScroll;

// TODO create hook
// import { Signal, useSignal } from "@preact/signals";
// import { useEffect } from "preact/hooks";

// export function useShowOnScroll(scrollValue?: number): Signal<boolean> {
//     const isVisible = useSignal(false);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (window.scrollY > window.innerHeight * (scrollValue || 0.5)) {
//                 isVisible.value = true;
//             } else {
//                 isVisible.value = false;
//             }
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, [scrollValue]);

//     return isVisible;
// }
