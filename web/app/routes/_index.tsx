import HeroSection from "@/pages/landing/components/heroSection";
import Features from "@/pages/landing/components/features";
import CTA from "@/pages/landing/components/cta";
import Footer from "@/pages/landing/components/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}
