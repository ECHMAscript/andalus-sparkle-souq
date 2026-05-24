import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import Heritage from "@/components/Heritage";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Souq Al Andalus — Fine Arabic Jewelry, Hand-Forged in 21k Gold" },
      {
        name: "description",
        content:
          "Souq Al Andalus crafts heirloom Arabic jewelry in 21k gold — rings, necklaces, earrings and bridal sets shaped by twelve generations of artisans.",
      },
      { property: "og:title", content: "Souq Al Andalus — Fine Arabic Jewelry" },
      {
        property: "og:description",
        content: "Heirloom Arabic gold jewelry, hand-forged in the spirit of Al Andalus.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <Products />
        <Heritage />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
