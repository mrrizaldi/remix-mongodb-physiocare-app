import { Form, Link, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";

export function RegisterForm() {
  const actionData = useActionData<{
    errors?: {
      username?: string[];
      email?: string[];
      password?: string[];
      confirmPassword?: string[];
    };
    error?: string;
  }>();

  return (
    <div>
      <h2 className="mb-12 text-center text-3xl font-extrabold text-primary">
        Create your account
      </h2>
      <Form method="post" className="space-y-6">
        {/* Hidden input untuk action type */}
        <input type="hidden" name="action" value="register" />

        <div>
          <Label htmlFor="username">Username</Label>
          <div className="mt-1">
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
            />
          </div>
          {actionData?.errors?.username && (
            <p className="mt-1 text-sm text-destructive">
              {actionData.errors.username[0]}
            </p>
          )}
        </div>

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
              autoComplete="new-password"
              required
            />
          </div>
          {actionData?.errors?.password && (
            <p className="mt-1 text-sm text-destructive">
              {actionData.errors.password[0]}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
          />
          {actionData?.errors?.confirmPassword && (
            <p className="text-red-500 text-sm">
              {actionData.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        {actionData?.error && (
          <Alert variant="destructive">
            <AlertDescription>{actionData.error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full">
          Create account
        </Button>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Login here
          </Link>
        </p>
      </Form>
    </div>
  );
}
