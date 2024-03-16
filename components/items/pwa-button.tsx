import { Button } from "@/components/ui/button";
import { FaDownload } from "react-icons/fa6";

export function PwaButton() {
    return (
        <Button variant="ghost" size="icon" aria-label="PWA">
            <FaDownload className="h-5 w-5" />
        </Button>
    );
}
