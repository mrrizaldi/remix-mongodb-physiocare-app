import {
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  Stethoscope,
  Receipt,
  CalendarRange,
  Users,
  FileText,
  Bell,
  LineChart,
  CalendarClock,
  CreditCard,
  Package,
  UserCog,
  FileBarChart,
  Settings,
  Database,
  Lock,
  BarChart3,
  History,
  LucideIcon,
} from "lucide-react";

export type PageListsType = {
  icon: LucideIcon;
  label: string;
  href: string;
  description: string;
};

export const PatientPages = (basePath: string) => [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: `${basePath}`,
    description: "Appointment overview and notifications",
  },
  {
    icon: CalendarCheck,
    label: "Scheduling",
    href: `${basePath}/scheduling`,
    description: "Manage your appointments",
  },
  {
    icon: ClipboardList,
    label: "Medical Records",
    href: `${basePath}/medical-records`,
    description: "View your medical history",
  },
  {
    icon: Stethoscope,
    label: "Services",
    href: `${basePath}/services`,
    description: "Browse available services",
  },
  {
    icon: Receipt,
    label: "Payments",
    href: `${basePath}/payments`,
    description: "View payment history",
  },
];

export const DoctorPages = (basePath: string) => [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: `${basePath}`,
    description: "Daily schedule and metrics",
  },
  {
    icon: CalendarRange,
    label: "Schedule",
    href: `${basePath}/schedule`,
    description: "Manage practice schedule",
  },
  {
    icon: Users,
    label: "Patients",
    href: `${basePath}/patients`,
    description: "Patient management",
  },
  {
    icon: FileText,
    label: "Medical Records",
    href: `${basePath}/medical-records`,
    description: "Create and manage records",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: `${basePath}/notifications`,
    description: "Appointments and alerts",
  },
  {
    icon: LineChart,
    label: "Performance",
    href: `${basePath}/performance`,
    description: "View metrics and analytics",
  },
];

export const OfficerPages = (basePath: string) => [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: `${basePath}`,
    description: "Daily operations overview",
  },
  {
    icon: CalendarClock,
    label: "Appointments",
    href: `${basePath}/appointments`,
    description: "Manage appointments",
  },
  {
    icon: Users,
    label: "Patients",
    href: `${basePath}/patients`,
    description: "Patient database",
  },
  {
    icon: CreditCard,
    label: "Payments",
    href: `${basePath}/payments`,
    description: "Payment processing",
  },
  {
    icon: Package,
    label: "Inventory",
    href: `${basePath}/inventory`,
    description: "Stock management",
  },
  {
    icon: UserCog,
    label: "Staff",
    href: `${basePath}/staff`,
    description: "Staff management",
  },
  {
    icon: FileBarChart,
    label: "Reports",
    href: `${basePath}/reports`,
    description: "Analytics and reporting",
  },
];

export const AdminPages = (basePath: string) => [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: `${basePath}`,
    description: "System overview",
  },
  {
    icon: Settings,
    label: "System",
    href: `${basePath}/system`,
    description: "System configuration",
  },
  {
    icon: Database,
    label: "Master Data",
    href: `${basePath}/master-data`,
    description: "Manage master data",
  },
  {
    icon: UserCog,
    label: "Users",
    href: `${basePath}/users`,
    description: "User management",
  },
  {
    icon: Lock,
    label: "Roles",
    href: `${basePath}/roles`,
    description: "Role management",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: `${basePath}/analytics`,
    description: "Advanced analytics",
  },
  {
    icon: History,
    label: "Audit Logs",
    href: `${basePath}/audit-logs`,
    description: "System audit logs",
  },
  {
    icon: FileBarChart,
    label: "Reports",
    href: `${basePath}/reports`,
    description: "System reports",
  },
];

export const getPagesByRole = (
  role: string,
  basePath: string
): PageListsType[] => {
  switch (role) {
    case "PATIENT":
      return PatientPages(basePath);
    case "DOCTOR":
      return DoctorPages(basePath);
    case "OFFICER":
      return OfficerPages(basePath);
    case "ADMIN":
      return AdminPages(basePath);
    default:
      return [];
  }
};
