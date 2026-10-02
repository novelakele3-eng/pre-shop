import type { Product } from "../types";
import { productImages } from "./image-config";

export const categories = ["All", "Perfume", "Body Care", "Gift Set"];

export const products: Product[] = [
  { id: "p1", name: "Noir Élan", category: "Perfume", price: 1500, size: "100 ml", image: productImages.noirElan, badge: "Popular" },
  { id: "p2", name: "Velvet Oud", category: "Perfume", price: 1800, size: "100 ml", image: productImages.velvetOud, badge: "New" },
  { id: "p3", name: "Pure Bloom", category: "Perfume", price: 1250, size: "75 ml", image: productImages.pureBloom },
  { id: "p4", name: "Amber Mist", category: "Perfume", price: 1350, size: "80 ml", image: productImages.amberMist },
  { id: "p5", name: "Silk Body Set", category: "Body Care", price: 2200, size: "4 pcs", image: productImages.bodySet },
  { id: "p6", name: "Signature Gift", category: "Gift Set", price: 3200, size: "3 pcs", image: productImages.giftSet, badge: "Gift" }
];
