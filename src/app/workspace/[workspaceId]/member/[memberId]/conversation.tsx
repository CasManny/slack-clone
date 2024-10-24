import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import Header from "./header";
import ChatInput from "./chat-input";
import MessageList from "@/components/message-list";

interface ConversationProps {
  id: Id<"conversations">;
}
const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      <Header
        onClick={() => {}}
        memberName={member?.user.name}
        memberImage={member?.user.image}
          />
          <MessageList
              data={results}
              variant="conversation"
              memberImage={member?.user.image}
              memberName={member?.user.name}
              loadMore={loadMore}
              isLoadingMore={status === 'LoadingMore'}
              canLoadMore={status === 'CanLoadMore'}
          
          />
      <ChatInput placeholder={`Message ${member?.user.name}`} conversationId={id} />
    </div>
  );
};

export default Conversation;