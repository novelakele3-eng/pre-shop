/**
 * PRODUCT IMAGE CONFIG
 *
 * Add your real product image files to:
 *   public/images/
 *
 * Then change ONLY the filename on the right.
 * Example:
 *   noirElan: image("my-new-noir-photo.webp"),
 *
 * Supported by the browser: .jpg, .jpeg, .png, .webp, .avif, etc.
 */

const image = (filename: string) => `/images/${filename}`;

export const productImages = {
  noirElan: image("noir-elan.jpg"),
  velvetOud: image("velvet-oud.jpg"),
  pureBloom: image("pure-bloom.jpg"),
  amberMist: image("amber-mist.jpg"),
  bodySet: image("body-set.jpg"),
  giftSet: image("gift-set.jpg"),
} as const;

/**
 * HERO IMAGES (optional, draggable on the home page)
 * Put a transparent PNG/WEBP of your bottle in public/images/ and set the name,
 * e.g. main: image("hero-bottle.png"). Leave as null to use the built-in gold bottle.
 */
export const heroImages: { main: string | null } = {
  main: null,
};
