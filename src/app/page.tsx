import HeroBanner from "@/components/home/HeroBanner";
import Marquee from "@/components/ui/Marquee";
import FeaturedStrip from "@/components/home/FeaturedStrip";
import Manifesto from "@/components/home/Manifesto";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types";

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  const featured = products.slice(0, 4);

  return (
    <>
      <HeroBanner />
      <Marquee text="FASHION IS DEAD — WEAR THE VOID — SHOP NOTHING — " />
      <FeaturedStrip products={featured} />
      <Manifesto />
    </>
  );
}