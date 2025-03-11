import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Clock, Users } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-muted/50 py-20">
      <div className="container space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
            Our platform provides powerful tools to help you monitor your
            activities, analyze your data, and stay motivated.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="group overflow-hidden border-none bg-background/50 shadow-md transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Activity Tracking</h3>
              <p className="text-muted-foreground">
                Track time spent on tasks, books read, workouts completed, and
                more with our intuitive interface.
              </p>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-none bg-background/50 shadow-md transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Personalized Statistics
              </h3>
              <p className="text-muted-foreground">
                Get detailed insights and visualizations of your progress.
              </p>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-none bg-background/50 shadow-md transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Friend Challenges</h3>
              <p className="text-muted-foreground">
                Challenge your friends to reach goals together and stay
                motivated through friendly competition.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
