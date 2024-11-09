import { z } from "zod";

export const SignUpSchema = z
  .object({
    email: z.string().email(),
    username: z.string().regex(/^[a-zA-Z0-9._]+$/, {
      message:
        "Username hanya boleh mengandung huruf, angka, _ (underscore), dan . (titik), tanpa spasi",
    }),
    password: z.string().min(8).max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password dan konfirmasi password harus cocok",
  });

export const LoginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
