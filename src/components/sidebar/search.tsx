import { useTimetableStore } from "@/stores/timetable-store";
import { ListItem } from "@majusss/timetable-parser";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { DropdownContent } from "./dropdown";

export const Search: React.FC = () => {
  const timetable = useTimetableStore((state) => state.timetable);
  const [filteredData, setFilteredData] = useState<ListItem[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="grid">
      <div className="inline-flex h-12 w-full items-center gap-x-3 rounded-md border border-primary/10 bg-accent-secondary p-3 dark:border-primary/10">
        <SearchIcon className="text-primary/70" size={20} strokeWidth={2.5} />
        <input
          onChange={handleSearch}
          type="text"
          className="w-full bg-transparent text-sm font-medium text-primary/90 placeholder:text-primary/70 focus:outline-none"
          placeholder="Szukaj..."
        />
      </div>
      {filteredData.length > 0 && (
        <DropdownContent type="search" data={filteredData} />
      )}
    </div>
  );
};
