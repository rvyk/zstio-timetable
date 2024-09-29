import { SubstitutionListItem } from "@/types/optivum";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
import { create } from "zustand";

interface SubstitutionsStore {
  substitutions: SubstitutionsPage | null;
  setSubstitutions: (timetable: SubstitutionsPage) => void;
  filters: {
    class: SubstitutionListItem[];
    teacher: SubstitutionListItem[];
  };
  handleFilterChange: (
    type: "class" | "teacher",
    value: SubstitutionListItem,
  ) => void;
}

export const useSubstitutionsStore = create<SubstitutionsStore>((set) => ({
  substitutions: null,
  setSubstitutions: (substitutions) => set({ substitutions }),
  filters: {
    class: [],
    teacher: [],
  },
  handleFilterChange: (type, value) =>
    set((state) => {
      const exists = state.filters[type].some(
        (item) => item.name === value.name,
      );

      return {
        filters: {
          ...state.filters,
          [type]: exists
            ? state.filters[type].filter((item) => item.name !== value.name)
            : [...state.filters[type], value],
        },
      };
    }),
}));
