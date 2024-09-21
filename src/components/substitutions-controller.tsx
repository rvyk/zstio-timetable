"use client";

import { useSubstitutionsStore } from "@/stores/substitutions-store";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";
import { useEffect } from "react";

export const SubstitutionsController = ({
  substitutions,
}: {
  substitutions: SubstitutionsPage;
}) => {
  const setSubstitutions = useSubstitutionsStore(
    (state) => state.setSubstitutions,
  );

  useEffect(() => {
    setSubstitutions(substitutions);
  }, [substitutions, setSubstitutions]);

  return null;
};
