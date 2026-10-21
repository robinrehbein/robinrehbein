// Intrinsic sizes of the images in static/, so <img> reserves its box before it loads.
// Regenerate after adding or replacing an image.
export const imageSizes: Record<string, [number, number]> = {
  "/birdy_lanes.webp": [405, 720],
  "/birdy_shop.webp": [405, 720],
  "/curved_1_artwerk_poster.webp": [1600, 1200],
  "/curved_2_artwerk_poster.webp": [1600, 1200],
  "/curved_3_artwerk_poster.webp": [1600, 1200],
  "/dottie_gameplay.webp": [405, 720],
  "/dottie_skins.webp": [405, 720],
  "/drops_bean.webp": [324, 720],
  "/drops_library.webp": [324, 720],
  "/iphone_artwerk_landing.webp": [1323, 1600],
  "/iphone_kirchmaier_landing_1.webp": [1600, 1067],
  "/iphone_kirchmaier_landing_2.webp": [1600, 1067],
  "/lab_birdy.webp": [320, 320],
  "/lab_dottie.webp": [320, 320],
  "/lab_drops.webp": [320, 320],
  "/lab_mephi.webp": [320, 320],
  "/lab_mininetworks.webp": [320, 320],
  "/lab_pocketpi.webp": [320, 320],
  "/lab_trailscape.webp": [320, 320],
  "/macbook_artwerk_landing_light.webp": [1600, 1120],
  "/macbook_kirchmaier_landing_1.webp": [1600, 1200],
  "/macbook_kirchmaier_landing_2.webp": [1600, 1400],
  "/macbook_kirchmaier_landing_3.webp": [1600, 1067],
  "/me.webp": [1080, 1350],
  "/me_square.webp": [1100, 1100],
  "/mephi_title.webp": [1280, 720],
  "/mephi_trap.webp": [1280, 720],
  "/mininetworks_town.webp": [405, 720],
  "/mininetworks_wireless.webp": [405, 720],
  "/noah_landing_desktop.webp": [1440, 1000],
  "/noah_landing_mobile.webp": [780, 1688],
  "/og-image.jpg": [1200, 630],
  "/pocketpi_chat.webp": [540, 1200],
  "/pocketpi_sessions.webp": [540, 1200],
  "/trailscape_tours.webp": [324, 720],
  "/trailscape_training.webp": [324, 720],
};

export function sizeOf(src: string): { width?: number; height?: number } {
  const size = imageSizes[src];
  return size ? { width: size[0], height: size[1] } : {};
}
