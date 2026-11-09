import z from "zod";

export const loginSchema = z.object({
    username: z.string().min(3, {message: 'Username minimal harus 3 karakter'}),
    password: z.string().min(6, {message: 'Password minimal harus 6 karakter'}),
})

export type LoginInput = z.infer<typeof loginSchema>