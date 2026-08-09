import { MAX_RESULTS } from "@/constants/settings";
import { setLastVisitedCookie } from "@/lib/utils";
import { OptivumTimetable } from "@/types/optivum";
import { ListItem } from "@majusss/timetable-parser";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, KeyboardEvent, useCallback, useMemo } from "react";

const listKeys: Record<string, string> = {
  classes: "class",
  teachers: "teacher",
  rooms: "room",
};

export const useSearchResults = (
  timetable: OptivumTimetable | null | undefined,
  query: string,
) =>
  useMemo(() => {
    const needle = query.toLowerCase().trim();
    if (!needle || !timetable) return [];

    let results: ListItem[] = [];

    for (const key of Object.keys(listKeys)) {
      const items = timetable.list[key as keyof typeof timetable.list] ?? [];
      results = results.concat(
        items
          .filter((item) => item.name.toLowerCase().includes(needle))
          .map((item) => ({ ...item, type: listKeys[key] })),
      );
      if (results.length >= MAX_RESULTS) break;
    }

    return results.slice(0, MAX_RESULTS);
  }, [query, timetable]);

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  results: ListItem[];
}

/**
 * Samo pole — wyniki rysuje panel, który je otacza. Nakładka pozycjonowana
 * absolutnie i tak byłaby przycięta przez przewijalny kontener panelu bocznego
 * i szuflady.
 */
export const Search: FC<SearchProps> = ({ value, onChange, results }) => {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      const item = results[0];
      if (results.length === 1 && item && "value" in item) {
        const link = `/${item.type}/${item.value}`;
        router.push(link);
        setLastVisitedCookie(link);
      }
    },
    [results, router],
  );

  return (
    <div className="border-lines bg-accent-secondary focus-within:border-primary/20 focus-within:bg-foreground inline-flex h-11 w-full items-center gap-x-2.5 rounded-lg border px-3 transition-colors">
      <SearchIcon
        className="text-primary/45 shrink-0"
        size={17}
        strokeWidth={2}
      />
      <input
        name="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        type="search"
        autoComplete="off"
        aria-label="Szukaj klasy, nauczyciela lub sali"
        className="text-primary placeholder:text-primary/45 w-full min-w-0 bg-transparent text-sm focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        placeholder="Klasa, nauczyciel, sala…"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Wyczyść wyszukiwanie"
          className="text-primary/45 hover:text-primary -mr-1 grid size-8 shrink-0 place-content-center rounded-md transition-colors"
        >
          <XIcon size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};
