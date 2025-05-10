import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="container flex flex-col items-center justify-center py-20 text-center md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Track Your Progress,
          <span className="bg-gradient-to-r from-primary to-primary/30 bg-clip-text text-transparent">
            {" "}
            Achieve Your Goals.
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
        >
          The all-in-one platform to track your activities, visualize your
          progress, and challenge your friends to reach new heights.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="group">
            <Link to="/login" className="flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
