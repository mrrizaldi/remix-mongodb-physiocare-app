import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Form action="/logout" method="post" className="w-full">
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start text-sm font-normal"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </Form>
  );
}
