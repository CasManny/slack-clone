"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import Header from "./header";
import ChatInput from "./chat-input";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });
  if (channelLoading) {
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
    return <div className="h-full flex-col flex">
        <Header title={channel.name} />
        <div className="flex-1" />
        <ChatInput placeholder={`Message # ${channel.name}`} />

  </div>;
};

export default ChannelIdPage;
