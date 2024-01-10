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
      <Table className="md:flex hidden justify-center items-center">
        <TableCaption
          status={true}
          isSubstitutions={isSubstitution}
          className="flex-col justify-center !items-start"
        >
          <Skeleton className="w-[100px] h-[12px] rounded-full" />
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
                  <Skeleton className="w-[100px] h-[10px] rounded-full" />
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
      <div className="block md:hidden min-h-screen">
        <div className="w-full pb-2">
          <ul className="w-full px-1 text-sm dark:bg-[#171717] bg-[#F7F3F5] font-medium mt-2 text-center text-gray-500 flex justify-around items-center dark:text-gray-400">
            {[...Array(5)].map((_, index) => (
              <li
                key={index}
                className="
                 transition-all w-full mx-1 flex justify-center items-center cursor-pointer shadow-sm py-4 rounded-lg text-gray-900 bg-white focus:ring-transparent focus:outline-none dark:bg-[#242424] dark:text-white"
              >
                <Skeleton className="w-1/2 mx-1 h-[15px] rounded-full" />
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
              } dark:text-gray-300 flex shadow-sm border-zinc-100 m-1.5 first:mt-0 rounded-lg`}
            >
              <div
                className={`w-24 rounded-l py-1 my-2 flex-shrink-0 flex flex-col justify-center`}
              >
                <span className="text-center font-bold mb-1 flex justify-center items-center flex-col">
                  <Skeleton className="w-1/3 h-[10px] rounded-full my-1" />
                  <Skeleton className="w-1/2 h-[10px] rounded-full my-1" />
                </span>
              </div>

              <div className="w-full px-5 py-2 min-h-[4rem] flex flex-col justify-center">
                <Skeleton className="w-1/3 h-2 rounded-full my-1" />
                <Skeleton className="w-1/2 h-2 rounded-full my-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
