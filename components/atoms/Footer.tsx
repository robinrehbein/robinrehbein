import { IconHeart, IconHeartedHands, IconHeartInHand } from "../Icons.tsx";

const Footer = () => {
  return (
    <footer class={"max-w-screen-2xl mx-auto px-8 font-zodiak"}>
      <hr class={"my-16 border-foreground"} />
      <div class={"flex flex-col md:flex-row justify-between gap-4"}>
        <ul class={"flex flex-col items-end md:items-start"}>
          <li class={"hover:underline decoration-wavy"}>
            <a href="legal/html/imprint.html">Imprint</a>
          </li>
          <li class={"hover:underline decoration-wavy"}>
            <a href="legal/html/dataprotection.html">Data Protection</a>
          </li>
          <li class={"hover:underline decoration-wavy"}>
            <a href="legal/html/disclaimer.html">Disclaimer</a>
          </li>
        </ul>
        <ul
          class={"flex flex-col items-end gap-4 md:gap-0"}
        >
          <li class={"flex flex-col md:flex-row md:gap-1"}>
            <p>
              Copyright © {new Date().getFullYear()}.
            </p>
            <p>All rights reserved.</p>
          </li>
        </ul>
      </div>
      <p class={"flex flex-row items-center gap-1 justify-center mt-16"}>
        Made with <IconHeart class={"size-5 animate-pulse"} /> by Robin Rehbein
      </p>
      <hr class={"my-16 border-foreground"} />
    </footer>
  );
};

export default Footer;
