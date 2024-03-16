import { cn } from "@/lib/utils";
import Link from "next/link";

export function Footer({ className }: { className?: string }) {
    return (
        <footer
            className={cn(
                "flex min-h-20 items-center justify-between gap-3 border-t bg-background p-5 max-sm:flex-col max-sm:text-center sm:gap-5",
                className,
            )}
        >
            <p className="text-sm font-medium text-muted-foreground">
                © {new Date().getFullYear()} <span className="tracking-wide">Made with ❤️ for ZSTiO</span>
            </p>
            <p className="text-xs font-medium text-muted-foreground">
                by <Link href="https://github.com/XXCoreRangerX">crx</Link>,{" "}
                <Link href="https://github.com/lemonekq">lemonek</Link>,{" "}
                <Link href="https://github.com/majusss">majuś</Link>, <Link href="https://github.com/rvyk">rvyk</Link>
            </p>
        </footer>
    );
}
