import {
  Form,
  useNavigate,
  useActionData,
  useNavigation,
  useRevalidator,
} from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { z } from "zod";
import type { Profile, UpdateProfileInput } from "~/schema/profile";

export default function ProfileUpdateForm({ profile }: { profile: Profile }) {
  const actionData = useActionData<{
    errors?: z.ZodError<UpdateProfileInput>;
    error?: string;
  }>();
  const navigate = useNavigate();
  const transition = useNavigation();
  const { revalidate } = useRevalidator();
  const isSubmitting = transition.state === "submitting";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
        <CardDescription>Edit your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={profile.name}
                required
              />
              {actionData?.errors?.errors?.find(
                (e) => e.path[0] === "name"
              ) && (
                <p className="text-sm text-destructive">
                  {
                    actionData.errors.errors.find((e) => e.path[0] === "name")
                      ?.message
                  }
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                defaultValue={
                  profile.dob
                    ? new Date(profile.dob).toISOString().split("T")[0]
                    : ""
                }
              />
              {actionData?.errors?.errors?.find((e) => e.path[0] === "dob") && (
                <p className="text-sm text-destructive">
                  {
                    actionData.errors.errors.find((e) => e.path[0] === "dob")
                      ?.message
                  }
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                defaultValue={profile.age ?? ""}
              />
              {actionData?.errors?.errors?.find((e) => e.path[0] === "age") && (
                <p className="text-sm text-destructive">
                  {
                    actionData.errors.errors.find((e) => e.path[0] === "age")
                      ?.message
                  }
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" defaultValue={profile.gender ?? ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {actionData?.errors?.errors?.find(
                (e) => e.path[0] === "gender"
              ) && (
                <p className="text-sm text-destructive">
                  {
                    actionData.errors.errors.find((e) => e.path[0] === "gender")
                      ?.message
                  }
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={profile.address ?? ""}
              />
              {actionData?.errors?.errors?.find(
                (e) => e.path[0] === "address"
              ) && (
                <p className="text-sm text-destructive">
                  {
                    actionData.errors.errors.find(
                      (e) => e.path[0] === "address"
                    )?.message
                  }
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={profile.phone ?? ""}
              />
              {actionData?.errors?.errors?.find(
                (e) => e.path[0] === "phone"
              ) && (
                <p className="text-sm text-destructive">
                  {
                    actionData.errors.errors.find((e) => e.path[0] === "phone")
                      ?.message
                  }
                </p>
              )}
            </div>
          </div>

          {actionData?.error && (
            <p className="text-sm text-destructive">{actionData.error}</p>
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
