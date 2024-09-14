import { useTimetableStore } from "@/stores/timetable-store";
import { ListItem } from "@majusss/timetable-parser";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { DropdownContent } from "./dropdown";

export const Search: React.FC = () => {
  const timetable = useTimetableStore((state) => state.timetable);
  const [filteredData, setFilteredData] = useState<ListItem[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

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

  const calculateHash = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.currentTarget.value;
      const targetHash =
        "542bcfea6d679456c73c545f17c7f7beeac763a68157eff4d3291473348b6d5c";
      const inputHash = await calculateHash(input);

      if (inputHash === targetHash) {
        setShowEasterEgg(true);
      }
    }
  };

  return (
    <div className="grid">
      <div className="inline-flex h-12 w-full items-center gap-x-3 rounded-md border border-primary/10 bg-accent-secondary p-3 dark:border-primary/10">
        <SearchIcon className="text-primary/70" size={20} strokeWidth={2.5} />
        <input
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          type="text"
          className="w-full bg-transparent text-sm font-medium text-primary/90 placeholder:text-primary/70 focus:outline-none"
          placeholder="Szukaj..."
        />
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
