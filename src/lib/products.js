import ring from "@/assets/product-ring.jpg";
import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

// Standard size guides per category. "custom" is always offered as a final
// option so the user can type their own measurements.
export const sizeGuides = {
  Rings: ["5", "6", "7", "8", "9", "10"],
  Necklaces: ['16"', '18"', '20"', '22"', '24"'],
  Earrings: ["Small", "Medium", "Large"],
  Bracelets: ['6.5"', '7"', '7.5"', '8"'],
  Anklets: ['9"', '10"', '11"'],
  Bridal: ["Petite", "Standard", "Grande"],
};

// All products. Each carries category + style + material + occasion so the
// category page filter bar can narrow them down.
export const products = [
  { id: "zahra-ring", name: "Zahra Filigree Ring", category: "Rings", style: "Khaleeji", material: "21k Gold", occasion: "Everyday", price: 1240, was: null, img: ring, tag: "New", stock: 24, rating: 4.9, reviews: 124, description: "Hand-pierced filigree band inspired by the gardens of Granada. Forged in 21k gold by our atelier in Damascus." },
  { id: "granada-necklace", name: "Granada Medallion", category: "Necklaces", style: "Traditional", material: "21k Gold", occasion: "Statement", price: 2180, was: null, img: necklace, tag: "Bestseller", stock: 18, rating: 5.0, reviews: 312, description: "An eight-pointed star medallion echoing the tilework of the Alhambra, suspended on a fine box chain." },
  { id: "cordoba-earrings", name: "Cordoba Chandelier", category: "Earrings", style: "Statement", material: "21k Gold", occasion: "Evening", price: 1490, was: 1860, img: earrings, tag: "-20%", stock: 6, rating: 4.8, reviews: 87, description: "Cascading chandelier earrings drawn from Andalusi arabesque, weightless against the lobe." },
  { id: "damascene-bangle", name: "Damascene Bangle", category: "Bracelets", style: "Traditional", material: "21k Gold", occasion: "Everyday", price: 3420, was: null, img: bracelet, tag: "Limited", stock: 3, rating: 4.9, reviews: 56, description: "Inlaid Damascene work over a solid 21k bangle. A single piece may take three weeks to complete." },
  { id: "alhambra-pendant", name: "Alhambra Pendant", category: "Necklaces", style: "Modern", material: "18k Gold", occasion: "Everyday", price: 980, was: null, img: necklace, tag: null, stock: 42, rating: 4.7, reviews: 201, description: "Sharp geometry softened by a brushed satin finish — a quiet nod to Andalusi architecture." },
  { id: "saffron-earrings", name: "Saffron Drop Earrings", category: "Earrings", style: "Modern", material: "18k Gold", occasion: "Everyday", price: 760, was: 950, img: earrings, tag: "-20%", stock: 9, rating: 4.8, reviews: 142, description: "Delicate teardrops in warm 18k gold, finished with a hand-rubbed glow." },
  { id: "royal-ring", name: "Royal Andalus Ring", category: "Rings", style: "Engagement", material: "21k Gold", occasion: "Bridal", price: 1880, was: null, img: ring, tag: "New", stock: 15, rating: 5.0, reviews: 38, description: "A regal signet drawn from a 12th-century Andalusi seal, set with a single brilliant diamond." },
  { id: "sultana-cuff", name: "Sultana Cuff", category: "Bracelets", style: "Statement", material: "21k Gold", occasion: "Evening", price: 2640, was: null, img: bracelet, tag: null, stock: 21, rating: 4.9, reviews: 91, description: "A bold open cuff hammered by hand. The form is unfinished by design — meant to live on the wrist." },
  { id: "noor-bridal-set", name: "Noor Bridal Parure", category: "Bridal", style: "Bridal", material: "21k Gold", occasion: "Bridal", price: 8400, was: null, img: necklace, tag: "Limited", stock: 4, rating: 5.0, reviews: 22, description: "A complete bridal parure — necklace, earrings, bangles and ring — drawn from the dowries of Al Andalus." },
  { id: "henna-anklet", name: "Henna Anklet", category: "Anklets", style: "Traditional", material: "21k Gold", occasion: "Bridal", price: 940, was: null, img: bracelet, tag: "New", stock: 12, rating: 4.8, reviews: 67, description: "Tiny bells trace the ankle — a piece traditionally gifted on the henna night." },
  { id: "yasmin-anklet", name: "Yasmin Chain Anklet", category: "Anklets", style: "Modern", material: "18k Gold", occasion: "Everyday", price: 520, was: null, img: bracelet, tag: null, stock: 0, rating: 4.7, reviews: 41, description: "A whisper-fine chain anklet for daily wear, finished with a small jasmine charm." },
  { id: "amira-bridal-ring", name: "Amira Bridal Ring", category: "Bridal", style: "Bridal", material: "21k Gold", occasion: "Bridal", price: 3200, was: 3800, img: ring, tag: "-15%", stock: 7, rating: 4.9, reviews: 53, description: "A bridal halo ring framed in 21k milgrain and a row of certified diamonds." },
  { id: "andalus-signet", name: "Andalus Signet Ring", category: "Rings", style: "Modern", material: "21k Gold", occasion: "Statement", price: 1620, was: null, img: ring, tag: "New", stock: 0, rating: 5.0, reviews: 4, description: "A new arrival from the atelier — pre-order now, shipping next season." },
];

// Categories shown on the home page tiles and used to filter the product grid.
export const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Bridal", "Anklets"];

// Categories surfaced as their own pages from the home page "Shop by category"
// grid (in display order).
export const categoryTiles = [
  { name: "Rings", icon: "◈", blurb: "Bands, signets & halos" },
  { name: "Necklaces", icon: "❋", blurb: "Medallions & chains" },
  { name: "Earrings", icon: "✦", blurb: "Studs to chandeliers" },
  { name: "Bracelets", icon: "❉", blurb: "Cuffs & bangles" },
  { name: "Bridal", icon: "✺", blurb: "Parures & sets" },
  { name: "Anklets", icon: "◇", blurb: "Khalkhal & chains" },
];

export const filterOptions = {
  Style: ["Bridal", "Engagement", "Wedding", "Khaleeji", "Traditional", "Modern", "Statement"],
  Material: ["21k Gold", "18k Gold", "Silver", "Mixed"],
  Occasion: ["Everyday", "Evening", "Bridal", "Statement"],
};

import { getCustomProducts, findCustomProduct } from "@/lib/custom-products";

export function getAllProducts() {
  return [...getCustomProducts(), ...products];
}

export function findProductById(id) {
  return findCustomProduct(id) ?? products.find((p) => p.id === id);
}

export function productsByCategory(category) {
  const all = getAllProducts();
  if (!category || category === "All") return all;
  const norm = category.toLowerCase();
  return all.filter((p) => p.category.toLowerCase() === norm);
}

