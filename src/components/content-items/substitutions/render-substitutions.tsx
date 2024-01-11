import Filters from "@/components/content-items/substitutions/filters";
import { parseBranchField } from "@/components/content-items/substitutions/substitutions";
import { ListLargeItem, ListRow, ListSmallItem } from "@/components/ui/list";
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

interface RenderSubstitutionsProps {
  index: number;
  filteredSubstitutions: Substitution[];
  status: boolean;
  time: string;
}

const RenderSubstitutions: React.FC<RenderSubstitutionsProps> = ({
  index,
  filteredSubstitutions,
  status,
  time,
}) => {
  return (
    <Table className="hidden md:flex justify-center">
      <TableCaption
        status={status}
        isSubstitutions={true}
        className="flex-col justify-center !items-start"
      >
        {time}
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
            <Link href={process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL as string}>
              Źródło danych
            </Link>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

const RenderSubstitutionsMobile: React.FC<RenderSubstitutionsProps> = ({
  filteredSubstitutions,
  index,
  time,
  status,
}) => {
  return (
    <div className="min-h-screen">
      <div className="w-full">
        <div className="dark:bg-[#242424] bg-white mx-1.5 my-2.5 min-h-12 rounded-md flex justify-center items-center">
          <p className="font-semibold text-gray-900 dark:text-white p-2 text-center">
            {status ? time : "Brak zastępstw"}
          </p>
        </div>
      </div>
      <div key={index} className="overflow-x-auto w-full text-center text-sm">
        {!!filteredSubstitutions.length ? (
          <>
            {filteredSubstitutions.map(
              (substitution: Substitution, index: number) => {
                return (
                  <div key={index} className="w-fit">
                    <ListRow reverseColor={index % 2 == 0}>
                      <ListSmallItem className="min-w-32">
                        <div className="flex justify-center items-center flex-col">
                          <p className="text-xs font-semibold">Lekcja</p>
                          <div className="flex flex-col">
                            <p className="font-semibold">
                              {substitution.lesson.split(",")[0]}
                            </p>
                            <p className="font-semibold">
                              {substitution.lesson.split(",")[1]}
                            </p>
                          </div>
                        </div>
                      </ListSmallItem>
                      <ListLargeItem isSubstitutions>
                        <p className="text-xs font-semibold">
                          Nauczyciel / Oddział
                        </p>
                        <p className="text-wrap">{substitution.teacher}</p>
                        <p className="text-wrap font-semibold">
                          {parseBranchField(substitution.branch)}
                        </p>
                      </ListLargeItem>
                      <ListLargeItem isSubstitutions>
                        <p className="text-xs font-semibold">
                          Przedmiot / Sala
                        </p>
                        <p className="text-wrap">{substitution.subject}</p>
                        <p className="text-wrap font-semibold">
                          {substitution.class}
                        </p>
                      </ListLargeItem>
                      <ListLargeItem isSubstitutions>
                        <p className="text-xs font-semibold">
                          Zastępca / Uwagi
                        </p>
                        <p className="text-wrap">{substitution.case}</p>
                        <p className="text-wrap">{substitution.message}</p>
                      </ListLargeItem>
                    </ListRow>
                  </div>
                );
              },
            )}
          </>
        ) : (
          <div className="text-center w-full">
            <p className="font-semibold text-lg">Nie znaleziono zastępstw</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { RenderSubstitutions, RenderSubstitutionsMobile };
