import { SubstitutionsController } from "@/components/substitutions-controller";
import { Substitutions } from "@/components/substitutions/substitutions";
import { Topbar } from "@/components/topbar/topbar";
import { fetchSubstitutions } from "@/lib/fetchers/substitutions";
import { Fragment } from "react";

export const generateMetadata = async () => {
  const substitutions = await fetchSubstitutions();

  return {
    title: substitutions.heading,
    description: `Sprawdź zastępstwa w ZSTiO na (${substitutions.timeRange})`,
  };
};

const SubstitutionPage = async () => {
  const substitutions = await fetchSubstitutions();

  return (
    <Fragment>
      <SubstitutionsController substitutions={substitutions} />
      <div className="flex h-full w-full flex-col gap-y-6 overflow-hidden p-8">
        <Topbar substitutions={substitutions} />
        <Substitutions substitutions={substitutions} />
      </div>
    </Fragment>
  );
};

export default SubstitutionPage;
