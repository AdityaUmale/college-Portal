import { z } from 'zod';

export const AnnouncementSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
});
