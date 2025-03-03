import { z } from "zod";

export const challengeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  goal: z.number().positive("Goal must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  participants: z.array(z.string()).optional(),
});
