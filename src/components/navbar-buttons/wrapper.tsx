import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface ButtonWrapperProps {
  tooltipText: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = (
  { tooltipText, onClick, children },
) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="navbar"
          size="navbar"
          onClick={onClick}
          className="mr-2 p-3 text-xs"
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
