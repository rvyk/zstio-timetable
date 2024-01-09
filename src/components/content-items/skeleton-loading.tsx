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
    <Table>
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
  );
};

export default SkeletonLoading;
