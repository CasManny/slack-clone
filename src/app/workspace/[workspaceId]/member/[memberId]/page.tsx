'use client'

import { useCreateOrGetConversations } from "@/features/conversations/api/use-create-or-get-conversations"
import { useMemberId } from "@/hooks/use-member-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, DatabaseZapIcon, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Doc, Id } from "../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import Conversation from "./conversation"

const MemberIdPage = () => {
    const workspaceId = useWorkspaceId()
    const memberId = useMemberId()
    const [conversationId, setConversationId] = useState<Id<'conversations'> | null>(null)
    const { isPending, mutate } = useCreateOrGetConversations()
    
    useEffect(() => {
        mutate({
            workspaceId,
            memberId
        }, {
            onSuccess: (data) => {
                setConversationId(data)
            },
            onError: () => {
                toast.error("Failed to create or get conversations")
            }
        })
    }, [memberId, workspaceId])

    if (isPending) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }
    if (!conversationId) {
        return (
            <div className="h-full flex flex-col gap-y-2 items-center justify-center">
                <AlertTriangle className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">conversation not found</span>
            </div>
        )
    }
  return (
      <Conversation id={conversationId} />
  )
}

export default MemberIdPage