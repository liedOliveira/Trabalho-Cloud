import { z } from 'zod';

export const createAppointmentSchema = z.object({
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data inválida',
  }),
});

export const updateAppointmentSchema = z.object({
  title: z.string().min(2, 'Título deve ter no mínimo 2 caracteres').optional(),
  description: z.string().optional(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida' })
    .optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
