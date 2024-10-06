import { MAX_RESULTS } from "@/constants/settings";
import {
  cn,
  getUniqueSubstitutionList,
  setLastVisitedCookie,
} from "@/lib/utils";
import { OptivumTimetable, SubstitutionListItem } from "@/types/optivum";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
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

export const Search: FC<{
  timetable?: OptivumTimetable | null;
  substitutions?: SubstitutionsPage | null;
}> = ({ timetable, substitutions }) => {
  const { isPreview } = useSidebarContext();
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleClearSearch = useCallback(() => {
    setValue("");
  }, []);

  const filteredData = useMemo(() => {
    const query = value.toLowerCase().trim();
    if (!query) return [];

    let results: (ListItem | SubstitutionListItem)[] = [];

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

    if (substitutions) {
      const uniqueItems = [
        ...getUniqueSubstitutionList("teacher", substitutions),
        ...getUniqueSubstitutionList("class", substitutions),
      ]
        .filter((item) => item.name.toLowerCase().includes(query))
        .slice(0, MAX_RESULTS - results.length);

      results = results.concat(uniqueItems);
    }

    return results.slice(0, MAX_RESULTS);
  }, [value, timetable, substitutions]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && filteredData.length === 1) {
        const item = filteredData[0];
        if ("value" in item) {
          const link = `/${item.type}/${item.value}`;
          router.push(link);
          setLastVisitedCookie(link);
        }
      }
    },
    [filteredData, router],
  );

  return (
    <div className={cn(isPreview && "place-content-center", "grid")}>
      <div
        className={cn(
          isPreview ? "w-12" : "w-full",
          "inline-flex h-12 items-center justify-between rounded-md border border-primary/10 bg-accent-secondary p-3 dark:border-primary/10",
        )}
      >
        <div className="mr-2 flex w-full items-center gap-x-3">
          <SearchIcon className="text-primary/70" size={20} strokeWidth={2.5} />
          <input
            name="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            autoComplete="off"
            className={cn(
              isPreview && "hidden",
              "w-full bg-transparent text-xs font-medium text-primary/90 placeholder:text-primary/70 focus:outline-none sm:text-sm",
            )}
            placeholder="Szukaj..."
          />
        </div>
        {value && isPreview == false && (
          <button
            onClick={handleClearSearch}
            className="text-primary/70 hover:text-primary/90"
          >
            <XIcon size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>
      {filteredData.length > 0 && (
        <DropdownContent type="search" data={filteredData} />
      )}
    </div>
  );
};
