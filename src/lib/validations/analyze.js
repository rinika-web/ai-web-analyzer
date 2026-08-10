import { z } from "zod";

export const analyzeSchema = z.object({

    url: z
        .string()
        .trim()
        .url("Please enter a valid URL")
        .max(2048, "URL is too long")

});