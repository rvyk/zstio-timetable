import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
import { create } from "zustand";

interface SubstitutionsStore {
  substitutions: SubstitutionsPage | null;
  setSubstitutions: (timetable: SubstitutionsPage) => void;
  filters: {
    class: string[];
    teacher: string[];
  };
  handleFilterChange: (type: "class" | "teacher", value: string) => void;
}

export const useSubstitutionsStore = create<SubstitutionsStore>((set) => ({
  substitutions: null,
  setSubstitutions: (substitutions) => set({ substitutions }),
  filters: {
    class: [],
    teacher: [],
  },
  handleFilterChange: (type, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [type]: state.filters[type].includes(value)
          ? state.filters[type].filter((i) => i !== value)
          : [...state.filters[type], value],
      },
    })),
}));
