import { Dropdown } from "@/components/content-items/bottom-bar/dropdown";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { List } from "@wulkanowy/timetable-parser";
import { useState } from "react";

interface SearchBarProps {
  timeTableList: List;
}

const SearchBar: React.FC<SearchBarProps> = ({ timeTableList }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { type: string; name: string; value: string }[]
  >([]);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;

    setQuery(term);
    const classResults = timeTableList.classes
      .filter((cls) => cls.name.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 8)
      .map((classes) => ({ ...classes, type: "class" }));

    const teacherResults =
      timeTableList.teachers
        ?.filter((teacher) =>
          teacher.name.toLowerCase().includes(term.toLowerCase()),
        )
        .slice(0, 8)
        .map((teachers) => ({ ...teachers, type: "teacher" })) || [];

    const roomsResults =
      timeTableList.rooms
        ?.filter((room) => room.name.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 8)
        .map((rooms) => ({ ...rooms, type: "room" })) || [];

    setSearchResults([...classResults, ...teacherResults, ...roomsResults]);
  };

  return (
    <div className="mb-1.5 w-full">
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </div>
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-900 outline-none ring-0 dark:border-none dark:bg-[#202020] dark:text-gray-300 dark:placeholder-gray-300"
          placeholder="Wyszukaj klasę, nauczyciela i salę..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsDropdownOpened(true)}
          onBlur={() => setIsDropdownOpened(false)}
        />
      </div>
      {!!searchResults.length && (
        <Dropdown isOpened={isDropdownOpened} results={searchResults} />
      )}
    </div>
  );
};

export default SearchBar;
