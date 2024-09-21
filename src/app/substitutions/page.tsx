import { SubstitutionsController } from "@/components/substitutions-controller";
import { fetchSubstitutions } from "@/lib/fetchers/substitutions";
import React from "react";

const SubstitutionPage = async () => {
  const substitutions = await fetchSubstitutions();

  return (
    <React.Fragment>
      <SubstitutionsController substitutions={substitutions} />
    </React.Fragment>
  );
};

export default SubstitutionPage;
