import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface PreferencesModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  initialValue: string;
}

const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This actions is irrevisible"
  );
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSettled: () => {
          setEditOpen(false);
          toast.success("Workspace updated");
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          setEditOpen(false);
          router.replace(`/`);
          toast.success("workspace deleted successfully");
        },
        onError: () => {
          toast.error("Failed to remove workspace");
        },
      }
    );
  };
  return (
    <>
      <ConfirmDialog />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
            <div className="px-4 pb-4 flex flex-col gap-y">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">workspace name</p>
                      <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                        Edit
                      </p>
                    </div>
                    <p className="text-sm">{value}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this workspace</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleEdit}>
                    <Input
                      value={value}
                      disabled={isUpdatingWorkspace}
                      onChange={(e) => setValue(e.target.value)}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="Workspace name e.g 'work', 'personal', 'home'"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant={"outline"}
                          disabled={isUpdatingWorkspace}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button disabled={isUpdatingWorkspace}>Save</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <button
                disabled={isRemovingWorkspace}
                onClick={handleRemove}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
              >
                <Trash />
                <p className="text-xs font-semibold">Delete workspace</p>
              </button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
