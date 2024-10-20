import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

interface ChatInputProps {
  placeholder: string;

}

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
const ChatInput = ({placeholder}: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)
  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={() => { }}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
