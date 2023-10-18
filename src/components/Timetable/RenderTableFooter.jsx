import Link from "next/link";

export default function RenderTableHeader({
  hours,
  validDate,
  generatedDate,
  status,
  timeTableID,
}) {
  return (
    <tfoot
      className={`bg-[#2B161B] ${
        Object.entries(hours)?.length % 2 == 0
          ? "bg-white dark:bg-gray-800"
          : "bg-gray-100 dark:bg-gray-700"
      }`}
    >
      <tr className="font-semibold text-gray-900 dark:text-white">
        {status && (
          <td
            scope="row"
            colSpan={5}
            className="px-6 py-4 font-semibold w-1 text-left text-gray-900 whitespace-nowrap dark:text-gray-100 transition-all"
          >
            {generatedDate && `Wygenerowano: ${generatedDate}`}{" "}
            {validDate && `Obowiązuje od: ${validDate}`}
          </td>
        )}
        <td
          scope="row"
          colSpan={!status ? 7 : 2}
          className="px-6 py-4 font-semibold w-1 text-right text-gray-900 whitespace-nowrap dark:text-gray-100 transition-all"
        >
          <Link
            href={`${process.env.NEXT_PUBLIC_TIMETABLE_URL}/plany/${timeTableID}.html`}
            target="_blank"
          >
            Źródło danych
          </Link>
        </td>
      </tr>
    </tfoot>
  );
}