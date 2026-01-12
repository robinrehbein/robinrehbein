import { IconHeart, IconHeartedHands, IconHeartInHand } from "../Icons.tsx";

const Footer = () => {
  return (
    <footer class={"max-w-screen-2xl mx-auto px-8 font-zodiak"}>
      <hr class={"my-16 border-foreground"} />
      <div class={"flex flex-col md:flex-row justify-between gap-4"}>
        <ul class={"flex flex-col items-end md:items-start"}>
          <li class={"hover:underline decoration-wavy"}>
            <a href="/imprint">Imprint</a>
          </li>
          <li class={"hover:underline decoration-wavy"}>
            <a href="/privacy">Data Protection</a>
          </li>
          <li class={"hover:underline decoration-wavy"}>
            <a href="/disclaimer">Disclaimer</a>
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
      <p class={"flex flex-row items-center gap-1 justify-center my-16"}>
        Made with <IconHeart class={"size-5 animate-pulse"} /> by Robin Rehbein
      </p>
    </footer>
  );
};

export default Footer;
