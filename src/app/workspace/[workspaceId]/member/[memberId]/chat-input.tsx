import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface ChatInputProps {
  placeholder: string;
  conversationId: Id<"conversations">;
}

type CreateMessgeValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const [isPending, setIsPending] = useState(false);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessgeValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("Url not found");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload error");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }
      await createMessage(values, { throwError: true });
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };
  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        key={editorKey}
      />
    </div>
  );
};

export default ChatInput;
