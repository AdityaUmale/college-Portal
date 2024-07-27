import { z } from 'zod';

export const ClubSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
});

