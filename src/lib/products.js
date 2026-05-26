import ring from "@/assets/product-ring.jpg";
import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

// All products in the store. Adding a new item here will automatically:
// - appear in the Products grid (and in its category tab)
// - appear in the Navbar search dropdown (name + image)
// - be eligible to be favorited from the Favorites page
export const products = [
  { id: "zahra-ring", name: "Zahra Filigree Ring", category: "Rings", price: 1240, was: null, img: ring, tag: "New", stock: 24, rating: 4.9, reviews: 124 },
  { id: "granada-necklace", name: "Granada Medallion", category: "Necklaces", price: 2180, was: null, img: necklace, tag: "Bestseller", stock: 18, rating: 5.0, reviews: 312 },
  { id: "cordoba-earrings", name: "Cordoba Chandelier", category: "Earrings", price: 1490, was: 1860, img: earrings, tag: "-20%", stock: 6, rating: 4.8, reviews: 87 },
  { id: "damascene-bangle", name: "Damascene Bangle", category: "Bracelets", price: 3420, was: null, img: bracelet, tag: "Limited", stock: 3, rating: 4.9, reviews: 56 },
  { id: "alhambra-pendant", name: "Alhambra Pendant", category: "Necklaces", price: 980, was: null, img: necklace, tag: null, stock: 42, rating: 4.7, reviews: 201 },
  { id: "saffron-earrings", name: "Saffron Drop Earrings", category: "Earrings", price: 760, was: 950, img: earrings, tag: "-20%", stock: 9, rating: 4.8, reviews: 142 },
  { id: "royal-ring", name: "Royal Andalus Ring", category: "Rings", price: 1880, was: null, img: ring, tag: "New", stock: 15, rating: 5.0, reviews: 38 },
  { id: "sultana-cuff", name: "Sultana Cuff", category: "Bracelets", price: 2640, was: null, img: bracelet, tag: null, stock: 21, rating: 4.9, reviews: 91 },
];

export const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets"];

export function findProductById(id) {
  return products.find((p) => p.id === id);
}
