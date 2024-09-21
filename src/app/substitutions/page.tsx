import { SubstitutionsController } from "@/components/substitutions-controller";
import { fetchSubstitutions } from "@/lib/fetchers/substitutions";
import { Fragment } from "react";

const SubstitutionPage = async () => {
  const substitutions = await fetchSubstitutions();

  return (
    <Fragment>
      <SubstitutionsController substitutions={substitutions} />
    </Fragment>
  );
};

export default SubstitutionPage;
