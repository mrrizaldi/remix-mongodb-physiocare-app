import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "@remix-run/react";
import { Activity } from "lucide-react";
import { Service } from "~/schema/service";

export default function ServiceCard({ service }: { service: Service }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const baseUrl = pathname.split("/").slice(0, 3).join("/");
  console.log(service);

  const handleBooking = () => {
    navigate(`${baseUrl}/booking/${service.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${service.price}</div>
        <p className="text-xs text-muted-foreground">Per session</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleBooking} className="w-full">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
