import { z } from 'zod';

export const EventSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    link: z.string().url(),
});
