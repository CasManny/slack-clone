"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import Header from "./header";
import ChatInput from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import MessageList from "@/components/message-list";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { results, status, loadMore } = useGetMessages({ channelId });
  console.log(results)
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });
  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full justify-center items-center flex-1">
        <Loader className="text-muted-foreground animate-spin size-6" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex h-full flex-col gap-y-2 justify-center items-center flex-1">
        <TriangleAlert className="text-muted-foreground  size-6" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }
  return (
    <div className="h-full flex-col flex">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
