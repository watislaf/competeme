import { Link } from "@remix-run/react";
import { Button } from "web/app/components/ui/button";

export default function CTA() {
  return (
    <section className="container py-20">
      <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/30 p-8 text-center shadow-lg md:p-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Ready to Start Tracking Your Progress?
        </h2>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-lg">
          Join thousands of users who are achieving their goals with competeme.
          Sign up today!
        </p>
        <Button size="lg" className="mt-8">
          <Link to="/login">Sign Up Now</Link>
        </Button>
      </div>
    </section>
  );
}
