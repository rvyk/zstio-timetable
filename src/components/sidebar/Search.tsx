import { useT } from "@/components/common/LocaleProvider";
import { MAX_RESULTS } from "@/constants/settings";
import { setLastVisitedCookie } from "@/lib/utils";
import { useRecentStore } from "@/stores/recent";
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

export const Search: FC<SearchProps> = ({ value, onChange, results }) => {
  const translate = useT();
  const addRecent = useRecentStore((state) => state.addRecent);
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      const item = results[0];
      if (results.length === 1 && item && "value" in item) {
        const link = `/${item.type}/${item.value}`;
        router.push(link);
        setLastVisitedCookie(link);
        addRecent(item);
      }
    },
    [results, router, addRecent],
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
        aria-label={translate("search.aria")}
        className="text-primary placeholder:text-primary/45 w-full min-w-0 bg-transparent text-sm focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        placeholder={translate("search.placeholder")}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label={translate("search.clear")}
          className="text-primary/45 hover:text-primary animate-rise -mr-1 grid size-8 shrink-0 place-content-center rounded-md transition duration-150 active:scale-90"
        >
          <XIcon size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};
