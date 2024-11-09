// app/routes/auth.login.tsx
import { Link, useOutletContext } from "@remix-run/react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { login } from "~/utils/auth.server";
import { LoginSchema } from "~/schema/auth";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const { CardWrapper } = useOutletContext<{
    CardWrapper: ({ children }: { children: React.ReactNode }) => JSX.Element;
  }>();

  return (
    <>
      <CardWrapper>
        <LoginForm />
      </CardWrapper>
    </>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  try {
    const result = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      return json(
        {
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { headers } = await login({ ...result.data, request });
    return redirect("/dashboard", { headers });
  } catch (error: any) {
    return json(
      {
        error: error.message || "An error occurred during login",
      },
      { status: 400 }
    );
  }
};
