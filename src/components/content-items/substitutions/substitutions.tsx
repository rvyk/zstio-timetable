import {
  RenderSubstitutions,
  RenderSubstitutionsMobile,
} from "@/components/content-items/substitutions/render-substitutions";
import SubstitutionsBottomBar from "../substitutions-bottom-bar";

export const parseBranchField = (branch: string): string => {
  const regex = /(\w+)\|([^+]+)/g;
  let result = branch.replace(regex, "$1 ($2)");
  result = result.replace(/\+/g, " + ");
  return result.trim();
};

const Substitutions: React.FC<{ substitutions: Substitutions }> = ({
  substitutions,
}) => {
  const queryParams = new URLSearchParams(window.location.search);
  const branches = queryParams.get("branches")?.split(",") || [];
  const teachers = queryParams.get("teachers")?.split(",") || [];

  return (
    <>
      {substitutions.tables.map((table: SubstitutionTables, index: number) => {
        const filteredSubstitutions = table.zastepstwa.filter(
          (substitution: Substitution) =>
            (branches.length === 0 || branches.includes(substitution.branch)) &&
            (teachers.length === 0 || teachers.includes(substitution.teacher)),
        );

        return (
          <div key={index}>
            <div className="hidden md:block">
              <RenderSubstitutions
                index={index}
                filteredSubstitutions={filteredSubstitutions}
                status={substitutions.status}
                time={table.time}
              />
            </div>
            <div className="block md:hidden">
              <RenderSubstitutionsMobile
                index={index}
                filteredSubstitutions={filteredSubstitutions}
                status={substitutions.status}
                time={table.time}
              />
              <SubstitutionsBottomBar substitutions={substitutions} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Substitutions;
