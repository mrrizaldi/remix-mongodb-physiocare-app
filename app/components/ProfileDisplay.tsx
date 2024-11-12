import { useNavigate, useLocation } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ProfileDisplayProps } from "~/types/profile";

export default function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatDate = (date: Date | string | null): string => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Your personal and account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-sm">{profile?.name || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Date of Birth
              </h3>
              <p className="mt-1 text-sm">{formatDate(profile?.dob)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Age</h3>
              <p className="mt-1 text-sm">{profile?.age || "-"} years old</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Gender</h3>
              <p className="mt-1 text-sm">{profile?.gender || "-"}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="mt-1 text-sm">{profile?.address || "-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="mt-1 text-sm">{profile?.phone || "-"}</p>
          </div>

          {/* Add check for account object */}
          {profile.account && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-gray-500">
                Account Information
              </h3>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Username:{" "}
                  </span>
                  <span className="text-sm">
                    {profile.account?.username || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Email:{" "}
                  </span>
                  <span className="text-sm">
                    {profile.account?.email || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Role:{" "}
                  </span>
                  <span className="text-sm">
                    {profile.account?.role || "-"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => navigate(`${location.pathname}/update`)}
          className="w-full"
        >
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
