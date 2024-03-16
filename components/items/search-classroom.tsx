import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaMagnifyingGlass } from "react-icons/fa6";

export function SearchClassroom() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Classroom Search">
          <FaMagnifyingGlass className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search for an available classroom</DialogTitle>
          <DialogDescription>
            Available classrooms for the selected teaching day and time will be displayed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">Placeholder</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="lg" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" size="lg">
            Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
