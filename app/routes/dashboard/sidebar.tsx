import { Home, Calendar, FileText, CreditCard, User } from "lucide-react";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { useAuth } from "./useAuth";
import { Link, useLocation } from "@remix-run/react";
import LogoutButton from "../../components/LogoutButton";

const menuUserItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Calendar, label: "Scheduling", href: "/dashboard/scheduling" },
  { icon: FileText, label: "Medical Records", href: "/dashboard/records" },
  { icon: CreditCard, label: "Service", href: "/dashboard/services" },
];

const menuStaffItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Calendar, label: "Scheduling", href: "/dashboard/scheduling" },
  { icon: FileText, label: "Medical Records", href: "/dashboard/records" },
];

export default function SidebarComponent() {
  const { user } = useAuth();
  const menuItems = user?.role === "STAFF" ? menuStaffItems : menuUserItems;
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                className="flex items-center gap-3"
                to={`/dashboard/profile/${user?.id}`}
              >
                <Avatar>
                  <AvatarImage
                    // src={user?.avatar || "/avatar.png"}
                    alt={user?.username || "User"}
                  />
                  <AvatarFallback>
                    {user?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">
                    {user?.username || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3",
                    pathname === item.href
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
