// src/schemas/member.ts
import { z } from 'zod';

export const MemberSchema = z.object({
  id: z.number(),
  username: z.string().optional(),
  email: z.string().optional(),
  full_name: z.string().optional(),
  profile_picture: z.string().optional(),
  role: z.number(),
  role_name: z.string().optional(),
  initials: z.string().optional(),
  last_active: z.string().optional(),
});

export type Member = z.infer<typeof MemberSchema>;
