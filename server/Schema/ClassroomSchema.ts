import { z } from 'zod';

export const ClassroomSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
});

