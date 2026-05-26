// packages/validators/src/task.ts
import { z } from 'zod'
export const createTaskSchema = z.object({
title: z.string().min(1, 'Title is required').max(500),
description: z.string().optional(),
status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).default('TODO'),
priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
dueDate: z.string().datetime().optional(),
assigneeId: z.string().uuid().optional(),
labelIds: z.array(z.string().uuid()).default([]),
})
export const updateTaskSchema = createTaskSchema.partial()
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>