import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const SkeletonLoading: React.FC<{ isSubstitution?: boolean }> = ({
  isSubstitution,
}) => {
  return (
    <div>
      <Table className="hidden items-center justify-center md:flex">
        <TableCaption className="flex-col !items-start justify-center">
          <Skeleton className="h-[12px] w-[100px] rounded-full" />
        </TableCaption>
        <TableHeader isSubstitutions={isSubstitution} />
        {[...Array(7)].map((_, index) => (
          <tbody key={index}>
            <TableRow reverseColor={index % 2 == 0}>
              {[...Array(7)].map((_, index) => (
                <TableCell
                  key={index}
                  variant="substitutionNumber"
                  className="text-center"
                >
                  <Skeleton className="h-[10px] w-[100px] rounded-full" />
                </TableCell>
              ))}
            </TableRow>
          </tbody>
        ))}

        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={7}
              scope="row"
              className={`font-semibold ${!isSubstitution && "text-right"}`}
            >
              <Link
                prefetch={false}
                href={
                  isSubstitution
                    ? (process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL as string)
                    : (process.env.NEXT_PUBLIC_TIMETABLE_URL as string)
                }
                target="_blank"
              >
                Źródło danych
              </Link>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="block min-h-screen md:hidden">
        <div className="w-full pb-2">
          <ul className="mt-2 flex w-full items-center justify-around bg-[#F7F3F5] px-1 text-center text-sm font-medium text-gray-500 dark:bg-[#171717] dark:text-gray-400">
            {[...Array(5)].map((_, index) => (
              <li
                key={index}
                className="
                 mx-1 flex w-full cursor-pointer items-center justify-center rounded-lg bg-white py-4 text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-transparent dark:bg-[#242424] dark:text-white"
              >
                <Skeleton className="mx-1 h-[15px] w-1/2 rounded-full" />
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-full">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className={`text-gray-600 ${
                index % 2 === 0
                  ? "bg-white dark:bg-[#202020]"
                  : "bg-zinc-50 dark:bg-[#242424]"
              } m-1.5 flex rounded-lg border-zinc-100 shadow-sm first:mt-0 dark:text-gray-300`}
            >
              <div
                className={`my-2 flex w-24 flex-shrink-0 flex-col justify-center rounded-l py-1`}
              >
                <span className="mb-1 flex flex-col items-center justify-center text-center font-bold">
                  <Skeleton className="my-1 h-[10px] w-1/3 rounded-full" />
                  <Skeleton className="my-1 h-[10px] w-1/2 rounded-full" />
                </span>
              </div>

              <div className="flex min-h-[4rem] w-full flex-col justify-center px-5 py-2">
                <Skeleton className="my-1 h-2 w-1/3 rounded-full" />
                <Skeleton className="my-1 h-2 w-1/2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
