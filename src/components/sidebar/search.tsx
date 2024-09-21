import { searchHandleKeyDown } from "@/lib/easter-egg";
import { getUniqueSubstitutionList } from "@/lib/utils";
import { OptivumTimetable, SubstitutionListItem } from "@/types/optivum";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
import { ListItem } from "@majusss/timetable-parser";
import { SearchIcon, XIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DropdownContent } from "./dropdown";

const listKeys: Record<string, string> = {
  classes: "class",
  teachers: "teacher",
  rooms: "room",
};

const MAX_RESULTS = 5;

export const Search: React.FC<{
  timetable?: OptivumTimetable | null;
  substitutions?: SubstitutionsPage | null;
}> = ({ timetable, substitutions }) => {
  const [value, setValue] = useState("");
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleClearSearch = useCallback(() => {
    setValue("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      searchHandleKeyDown(e, setShowEasterEgg);
    },
    [],
  );

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

  return (
    <div className="grid">
      <div className="inline-flex h-12 w-full items-center justify-between rounded-md border border-primary/10 bg-accent-secondary p-3 dark:border-primary/10">
        <div className="mr-2 flex w-full items-center gap-x-3">
          <SearchIcon className="text-primary/70" size={20} strokeWidth={2.5} />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            className="w-full bg-transparent text-sm font-medium text-primary/90 placeholder:text-primary/70 focus:outline-none"
            placeholder="Szukaj..."
          />
        </div>
        {value && (
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
      {showEasterEgg && (
        <iframe
          src="https://dddavit.github.io/subway/"
          className="fixed left-1/2 top-1/2 z-50 h-[90vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 transform rounded-md"
        ></iframe>
      )}
    </div>
  );
};
