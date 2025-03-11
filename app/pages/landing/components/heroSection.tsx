import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="container flex flex-col items-center justify-center py-20 text-center md:py-32">
      <div className="animate-fade-up space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Track Your Progress,
          <span className="bg-gradient-to-r from-primary to-primary/30 bg-clip-text text-transparent">
            {" "}
            Achieve Your Goals.
          </span>
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          The all-in-one platform to track your activities, visualize your
          progress, and challenge your friends to reach new heights.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="group">
            <Link to="/login" className="flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
