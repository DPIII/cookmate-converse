import { cn } from "@/lib/utils";

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ChatContainer = ({ children, className }: ChatContainerProps) => {
  return (
    <div className={cn(
      "space-y-2 sm:space-y-4 bg-white p-3 sm:p-6 rounded-lg shadow-lg border border-primary/10",
      className
    )}>
      {children}
    </div>
  );
};