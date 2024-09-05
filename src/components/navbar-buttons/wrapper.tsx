import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonWrapperProps {
  tooltipText: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  tooltipText,
  onClick,
  children,
  className,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger aria-label={tooltipText}>
        <Button
          variant="navbar"
          size="navbar"
          onClick={onClick}
          className={cn("text-xs", className)}
          suppressHydrationWarning
          asChild
        >
          <div>{children}</div>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ButtonWrapper;
