"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../api/use-current-user";

const UserButton = () => {
    const { data, isLoading } = useCurrentUser();
    const { signOut } = useAuthActions()
  if (isLoading)
    return <Loader className="size-4 animate-spin text-muted-foreground" />;

  if (!data) return null;

  const { image, name } = data;
  const avatarFallback = name?.charAt(0).toUpperCase();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="size-10 hover:opacity-75 transistion">
          <AvatarImage alt={name} src={image} />
          <AvatarFallback className="bg-sky-500 text-white">{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;