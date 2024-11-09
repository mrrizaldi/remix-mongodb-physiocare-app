// app/components/LoginForm.tsx
import { Form, Link, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";

export function LoginForm() {
  const actionData = useActionData<{
    errors?: {
      email?: string[];
      password?: string[];
    };
    error?: string;
  }>();

  return (
    <div>
      <h2 className="mb-12 text-center text-3xl font-extrabold text-primary">
        Login to your account
      </h2>
      <Form method="post" className="space-y-6">
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          {actionData?.errors?.email && (
            <p className="mt-1 text-sm text-destructive">
              {actionData.errors.email[0]}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {actionData?.errors?.password && (
            <p className="mt-1 text-sm text-destructive">
              {actionData.errors.password[0]}
            </p>
          )}
        </div>
        {actionData?.error && (
          <Alert variant="destructive">
            <AlertDescription>{actionData.error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full">
          Sign in
        </Button>{" "}
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary/90"
          >
            Register here
          </Link>
        </p>
      </Form>
    </div>
  );
}
