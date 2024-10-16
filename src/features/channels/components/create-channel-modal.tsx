import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateChannelModal = () => {
    const [open, setOpen] = useCreateChannelModal();
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const [name, setName] = useState('')
    const {mutate, isPending} = useCreateChannel()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
        setName(value)
    }
    const handleClose = () => {
        setName('')
        setOpen(false)
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate({
            name,
            workspaceId
        }, {
            onSuccess: (id) => {
                toast.success("channel created")
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                handleClose()
            },
            onError: () => {
                toast.error('Failed to create a channel')
            }
        })
    }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              value={name}
              disabled={isPending}
              onChange={handleChange}
              required
              autoFocus
              minLength={3}
              maxLength={80}
              placeholder="e.g plan-budget"
            />
            <div className="flex justify-end">
              <Button disabled={isPending}>Create</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
