import { MAX_RESULTS } from "@/constants/settings";
import { cn, setLastVisitedCookie } from "@/lib/utils";
import { OptivumTimetable } from "@/types/optivum";
import { ListItem } from "@majusss/timetable-parser";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, KeyboardEvent, useCallback, useMemo, useState } from "react";
import { useSidebarContext } from "./Context";
import { DropdownContent } from "./Dropdown";

const listKeys: Record<string, string> = {
  classes: "class",
  teachers: "teacher",
  rooms: "room",
};

interface SearchProps {
  timetable?: OptivumTimetable | null;
}

export const Search: FC<SearchProps> = ({ timetable }) => {
  const { isPreview } = useSidebarContext();
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleClearSearch = useCallback(() => {
    setValue("");
  }, []);

  const filteredData = useMemo(() => {
    const query = value.toLowerCase().trim();
    if (!query) return [];

    let results: ListItem[] = [];

    if (timetable) {
      for (const key of Object.keys(listKeys)) {
        const items = timetable.list[key as keyof typeof timetable.list] ?? [];
        const matchingItems = items
          .filter((item) => item.name.toLowerCase().includes(query))
          .map((item) => ({ ...item, type: listKeys[key] }));
        results = results.concat(matchingItems);
        if (results.length >= MAX_RESULTS) break;
      }
    }

    return results.slice(0, MAX_RESULTS);
  }, [value, timetable]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && filteredData.length === 1) {
        const item = filteredData[0];
        if (item && "value" in item) {
          const link = `/${item.type}/${item.value}`;
          router.push(link);
          setLastVisitedCookie(link);
        }
      }
    },
    [filteredData, router],
  );

  return (
    <div
      className={cn(
        isPreview ? "place-content-center" : "sm:min-w-55",
        "relative grid",
      )}
    >
      <div
        className={cn(
          isPreview ? "w-12" : "w-full",
          "border-lines bg-accent-secondary focus-within:border-primary/20 focus-within:bg-foreground inline-flex h-11 items-center justify-between rounded-lg border px-3 transition-colors",
        )}
      >
        <div className="mr-2 flex w-full items-center gap-x-2.5">
          <SearchIcon
            className="text-primary/40 shrink-0"
            size={17}
            strokeWidth={2}
          />
          <input
            name="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            type="search"
            autoComplete="off"
            aria-label="Szukaj klasy, nauczyciela lub sali"
            className={cn(
              isPreview && "hidden",
              "text-primary placeholder:text-primary/35 w-full bg-transparent text-sm focus:outline-none [&::-webkit-search-cancel-button]:hidden",
            )}
            placeholder="Klasa, nauczyciel, sala…"
          />
        </div>
        {value && isPreview == false && (
          <button
            onClick={handleClearSearch}
            aria-label="Wyczyść wyszukiwanie"
            className="text-primary/40 hover:text-primary shrink-0 transition-colors"
          >
            <XIcon size={16} strokeWidth={2} />
          </button>
        )}
      </div>
      {value.trim() && !isPreview && (
        <div className="border-lines bg-foreground animate-rise absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-lg border p-1 shadow-(--shadow-raised)">
          {filteredData.length > 0 ? (
            <DropdownContent type="search" data={filteredData} />
          ) : (
            <p className="text-primary/40 px-3 py-3 text-sm">
              Nic nie pasuje do „{value.trim()}”.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
