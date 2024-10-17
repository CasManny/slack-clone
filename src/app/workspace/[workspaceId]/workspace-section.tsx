import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hint: string;
  OnNew?: () => void;
}
const WorkspaceSection = ({
  children,
  label,
  hint,
  OnNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);
  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-3.5 group">
        <Button
          variant={"transparent"}
          className="p-0.5 text-sm text-[#F9EDFFCC] shrink-0 size-6"
          onClick={toggle}
              >
                  
          <FaCaretDown className={cn('size-4 transition-transform', on && '-rotate-90')} />
        </Button>
        <Button
          variant={"transparent"}
          size={"sm"}
          className="group px-1.5 text-sm text-[#F9EDFFCC] h-[28px] justify-start overflow-hidden items-center"
        >
          <span className="truncate">{label}</span>
        </Button>

        {OnNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={OnNew}
              variant={"transparent"}
              size={"iconSm"}
              className="opacity-0 group-hover:opacity-100 size-6 shrink-0 transition-opacity ml-auto p-0.5 text-sm text-[#F9EDFFCC]"
            >
              <Plus className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      { on && children}
    </div>
  );
};

export default WorkspaceSection;
