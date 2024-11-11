import {
  Form,
  useNavigate,
  useActionData,
  useNavigation,
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
import { ProfileUpdateFormProps } from "~/types/profile";

export default function ProfileUpdateForm({ profile }: ProfileUpdateFormProps) {
  const actionData = useActionData<{
    errors?: {
      name?: string[];
      dob?: string[];
      age?: string[];
      gender?: string[];
      address?: string[];
      phone?: string[];
      username?: string[];
      email?: string[];
    };
    error?: string;
  }>();
  const navigate = useNavigate();
  const transition = useNavigation();
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
            </div>
            {actionData?.errors?.name && (
              <p className="mt-1 text-sm text-destructive">
                {actionData.errors.name[0]}
              </p>
            )}
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
            </div>
            {actionData?.errors?.dob && (
              <p className="mt-1 text-sm text-destructive">
                {actionData.errors.dob[0]}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                defaultValue={profile.age}
              />
            </div>
            {actionData?.errors?.age && (
              <p className="mt-1 text-sm text-destructive">
                {actionData.errors.age[0]}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select defaultValue={profile.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {actionData?.errors?.gender && (
              <p className="mt-1 text-sm text-destructive">
                {actionData.errors.gender[0]}
              </p>
            )}

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={profile.address}
              />
            </div>
            {actionData?.errors?.address && (
              <p className="mt-1 text-sm text-destructive">
                {actionData.errors.address[0]}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={profile.phone} />
            </div>
            {actionData?.errors?.phone && (
              <p className="mt-1 text-sm text-destructive">
                {actionData.errors.phone[0]}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={profile.account.username}
                required
              />
            </div>
            {actionData?.errors?.username && (
              <p className="mt-1 text-sm text-destructive">
                {actionData.errors.username[0]}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={profile.account.email}
                required
              />
            </div>
          </div>
          {actionData?.errors?.email && (
            <p className="mt-1 text-sm text-destructive">
              {actionData.errors.email[0]}
            </p>
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
