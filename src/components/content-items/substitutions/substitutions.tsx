import Filters from "@/components/content-items/substitutions/filters";
import {
  Table,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface Substitution {
  [key: string]: string;
}

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
          <Table key={index}>
            <TableCaption
              status={substitutions.status}
              isSubstitutions={true}
              className="flex-col justify-center !items-start"
            >
              {table.time}
              <Filters />
            </TableCaption>
            <TableHeader isSubstitutions={true} />
            {!!filteredSubstitutions.length ? (
              <>
                {filteredSubstitutions.map(
                  (substitution: Substitution, index: number) => {
                    return (
                      <tbody key={index}>
                        <TableRow reverseColor={index % 2 == 0}>
                          <TableCell variant="substitutionNumber">
                            <div className="flex justify-center items-center flex-col">
                              {substitution.lesson}
                            </div>
                          </TableCell>
                          {[
                            "teacher",
                            "branch",
                            "subject",
                            "class",
                            "case",
                            "message",
                          ].map((field) => (
                            <TableCell
                              key={field}
                              className="px-6 py-4 whitespace-nowrap border-r last:border-none dark:border-[#171717]"
                            >
                              {field === "branch"
                                ? parseBranchField(substitution.branch)
                                : substitution?.[field]}
                            </TableCell>
                          ))}
                        </TableRow>
                      </tbody>
                    );
                  },
                )}
              </>
            ) : (
              <tbody>
                <TableRow reverseColor={index % 2 == 0}>
                  <TableCell
                    scope="row"
                    colSpan={7}
                    className="text-center font-semibold"
                  >
                    Nie znaleziono zastępstw
                  </TableCell>
                </TableRow>
              </tbody>
            )}

            <TableFooter>
              <TableRow reverseColor={index % 2 != 0}>
                <TableCell scope="row" colSpan={7} className="font-semibold">
                  <Link
                    href={process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL as string}
                  >
                    Źródło danych
                  </Link>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        );
      })}
    </>
  );
};

export default Substitutions;
