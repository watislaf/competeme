import { z } from "zod";

export const challengeSchema = z.object({
  title: z.string().min(1, "Please enter a title."),
  description: z.string().min(1, "Please provide a description."),
  goal: z.number().positive("The goal must be a positive number."),
  unit: z.string().min(1, "Please specify a unit (e.g., km, hours, reps)."),
  participants: z.array(z.number()).optional(),
});
