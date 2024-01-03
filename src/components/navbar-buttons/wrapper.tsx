import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

function ButtonWrapper({
  tooltipText,
  onClick,
  children,
}: {
  tooltipText: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant="navbar"
          size="navbar"
          onClick={onClick}
          className="p-3 mr-2 text-xs"
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
}

export default ButtonWrapper;
