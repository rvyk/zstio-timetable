import { searchHandleKeyDown } from "@/lib/easter-egg";
import { useTimetableStore } from "@/stores/timetable-store";
import { ListItem } from "@majusss/timetable-parser";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { DropdownContent } from "./dropdown";

export const Search: React.FC = () => {
  const timetable = useTimetableStore((state) => state.timetable);
  const [filteredData, setFilteredData] = useState<ListItem[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [value, setValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    const query = e.target.value.toLowerCase();
    if (!query) {
      setFilteredData([]);
      return;
    }

    const maxResults = 5;
    const result: ListItem[] = [];
    const listKeys: Record<string, string> = {
      classes: "class",
      teachers: "teacher",
      rooms: "room",
    };

    for (const key of Object.keys(listKeys)) {
      const items = timetable?.list[key as keyof typeof timetable.list] ?? [];
      for (const item of items) {
        if (item.name.toLowerCase().includes(query)) {
          result.push({ ...item, type: listKeys[key] });
          if (result.length >= maxResults) break;
        }
      }
      if (result.length >= maxResults) break;
    }

    setFilteredData(result);
  };

  const handleClearSearch = () => {
    setValue("");
    setFilteredData([]);
  };

  return (
    <div className="grid">
      <div className="inline-flex h-12 w-full items-center justify-between rounded-md border border-primary/10 bg-accent-secondary p-3 dark:border-primary/10">
        <div className="mr-2 flex w-full items-center gap-x-3">
          <SearchIcon className="text-primary/70" size={20} strokeWidth={2.5} />
          <input
            value={value}
            onChange={handleSearch}
            onKeyDown={(e) => searchHandleKeyDown(e, setShowEasterEgg)}
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
