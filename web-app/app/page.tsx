import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
