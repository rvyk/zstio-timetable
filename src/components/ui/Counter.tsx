import { MAX_LESSONS } from "@/constants/hours";
import { MinusIcon, PlusIcon } from "lucide-react";
import { FC } from "react";
import { useCounter } from "usehooks-ts";
import { Button } from "./Button";

export const Counter: FC<
  ReturnType<typeof useCounter> & {
    minCount: number;
  }
> = ({ count, increment, decrement, minCount }) => {
  const handleDecrement = () => {
    count > minCount && decrement();
  };

  const handleIncrement = () => {
    count < MAX_LESSONS && increment();
  };

  return (
    <div className="flex w-full items-center justify-between">
      <Button
        variant="icon"
        size="icon"
        disabled={count === minCount}
        onClick={handleDecrement}
      >
        <MinusIcon className="h-5 w-5" />
        <span className="sr-only">Odejmij</span>
      </Button>

      <div className="grid gap-1 text-center">
        <h2 className="text-6xl font-semibold text-primary/90">{count}</h2>
        <p className="text-sm font-medium text-primary/70">Numer lekcji</p>
      </div>

      <Button
        variant="icon"
        size="icon"
        disabled={count === MAX_LESSONS}
        onClick={handleIncrement}
      >
        <PlusIcon className="h-5 w-5" />
        <span className="sr-only">Dodaj</span>
      </Button>
    </div>
  );
};
