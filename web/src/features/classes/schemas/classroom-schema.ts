import { z } from "zod";

const studentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  studentNo: z.number(),
});

export const classroomSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  students: z.array(studentSchema),
});

export const classroomsResponseSchema = z.array(classroomSchema);

export type ClassroomsResponse = z.infer<typeof classroomsResponseSchema>; 