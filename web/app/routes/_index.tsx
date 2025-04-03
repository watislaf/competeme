import CTA from "../pages/landing/components/cta";
import Features from "../pages/landing/components/features";
import Footer from "../pages/landing/components/footer";
import HeroSection from "../pages/landing/components/heroSection";

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
