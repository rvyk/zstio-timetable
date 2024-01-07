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

const Substitutions: React.FC<{ substitutions: Substitutions }> = ({
  substitutions,
}) => {
  return (
    <>
      {substitutions.tables.map((table: SubstitutionTables, index: number) => {
        return (
          <Table key={index}>
            <TableCaption status={substitutions.status}>
              {table.time}
            </TableCaption>
            <TableHeader isSubstitutions={true} />
            {table.zastepstwa.map(
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
                          {substitution?.[field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  </tbody>
                );
              },
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
