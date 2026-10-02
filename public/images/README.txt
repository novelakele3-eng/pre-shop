PRODUCT IMAGES — EASY SETUP
===========================

1. Put your product image files directly in this folder:
   public/images/

2. Open:
   src/data/image-config.ts

3. Change ONLY the filename for the product you want.

Example:
   noirElan: image("my-perfume-photo.webp"),

That means this file must exist here:
   public/images/my-perfume-photo.webp

You can use .jpg, .jpeg, .png, .webp, .avif, etc.

IMPORTANT:
- The filename must match exactly, including spaces, hyphens, and extension.
- Keep filenames simple. Recommended: lowercase + hyphens.
- You do NOT need to edit App.tsx or the HTML file just to add/change a product image.
- If an image is missing, the product card automatically shows the ADD YOUR IMAGE placeholder.

CURRENT IMAGE NAMES
-------------------
noir-elan.jpg
velvet-oud.jpg
pure-bloom.jpg
amber-mist.jpg
body-set.jpg
gift-set.jpg
