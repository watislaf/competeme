import { BarChart3, Clock, Users } from "lucide-react";
import { Card, CardContent } from "web/app/components/ui/card";

export default function Features() {
  return (
    <section className="bg-muted/50 py-20">
      <div className="container space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need to Succeed
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
            Our platform provides powerful tools to help you monitor your
            activities, analyze your data, and stay motivated. Join thousands of
            users who are achieving their goals with us.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1: Activity Tracking */}
          <Card className="group overflow-hidden border-none bg-background/50 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-bold">Activity Tracking</h2>
              <p className="text-muted-foreground">
                Track time spent on tasks, books read, workouts completed, and
                more with our intuitive interface.
              </p>
              <img
                src="https://www.svgrepo.com/show/530445/data-analysis.svg"
                alt="Activity Tracking"
                className="mt-4 h-24 w-24 mx-auto animate-pulse"
                loading="lazy"
              />
            </CardContent>
          </Card>

          {/* Feature 2: Personalized Statistics */}
          <Card className="group overflow-hidden border-none bg-background/50 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-bold">
                Personalized Statistics
              </h2>
              <p className="text-muted-foreground">
                Get detailed insights and visualizations of your progress with
                interactive charts and graphs.
              </p>
              <img
                src="https://www.svgrepo.com/show/530448/multiple-defenses.svg"
                alt="Personalized Statistics"
                className="mt-4 h-24 w-24 mx-auto "
                loading="lazy"
              />
            </CardContent>
          </Card>

          {/* Feature 3: Friend Challenges */}
          <Card className="group overflow-hidden border-none bg-background/50 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-bold">Friend Challenges</h2>
              <p className="text-muted-foreground">
                Challenge your friends to reach goals together and stay
                motivated through friendly competition.
              </p>
              <img
                src="https://www.svgrepo.com/show/530452/mobile-app.svg"
                alt="Friend Challenges"
                className="mt-4 h-24 w-24 mx-auto animate-spin-slow"
                loading="lazy"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
