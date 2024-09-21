"use server";

import Substitutions from "@majusss/substitutions-parser/dist/substitutions";
import { SubstitutionsPage } from "@majusss/substitutions-parser/dist/types";

export const fetchSubstitutions = async (): Promise<SubstitutionsPage> => {
  const url = process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL as string;

  try {
    const response = await fetch(url);
    const html = await response.text();

    return new Substitutions(html).parseSubstitutionSite();
  } catch (error) {
    console.error("Failed to fetch Substitutions:", error);
    return { heading: "", tables: [], timeRange: "" };
  }
};
