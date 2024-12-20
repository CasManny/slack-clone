import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import {
  AlertTriangle,
  ChevronDown,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}
const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace?"
  );
  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove Member",
    "Are you sure you want to remove member from this workspace?"
  );
  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Update member Role",
    "Are you sure you want to update member role?"
  );
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({ workspaceId });
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  const onRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };
  const onLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace("/");
          toast.success("You left the workspace");
          onClose();
        },
        onError: () => {
          toast.error("Failed to Leave the workspace");
        },
      }
    );
  };
  const onRoleChange = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();
    if (!ok) return;
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Role changed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to change role");
        },
      }
    );
  };
  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between h-[49px] px-4 items-center p-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full justify-center items-center">
          <Loader className="animate-spin size-5 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between h-[49px] px-4 items-center p-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full justify-center items-center">
          <AlertTriangle className=" size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const fallback = member.user?.name?.charAt(0).toUpperCase() || "M";
  return (
    <>
      <RemoveDialog />
      <UpdateDialog />
      <LeaveDialog />

      <div className="h-full flex flex-col">
        <div className="flex justify-between h-[49px] px-4 items-center p-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col  items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user?.image} />
            <AvatarFallback className="aspect-square text-6xl">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" && currentMember._id !== memberId ? (
            <div className="flex items-center gap-2 mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="capitalize w-full">
                    {member.role} <ChevronDown className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onRoleChange(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value={"admin"}>
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={"member"}>
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant={"outline"} className="w-full" onClick={onRemove}>
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== "admin" ? (
            <div className="mt-4">
              <Button className="w-full" variant={"outline"} onClick={onLeave}>
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted items-center flex justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col ">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user?.email}`}
                className="text-sm hover:underline tesxt-[#1264a3]"
              >
                {member.user?.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
