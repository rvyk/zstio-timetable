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
          ? "bg-white dark:bg-[#191919]"
          : "bg-gray-50 dark:bg-[#202020]"
      }`}
    >
      <tr className="font-semibold text-gray-900 dark:text-gray-300">
        {status && (
          <td
            scope="row"
            colSpan={5}
            id="desktopDateTest"
            className="px-6 py-4 font-semibold w-1 text-left text-gray-900 whitespace-nowrap dark:text-gray-300 transition-all"
          >
            {generatedDate && `Wygenerowano: ${generatedDate}`}{" "}
            {validDate && `Obowiązuje od: ${validDate}`}
          </td>
        )}
        <td
          scope="row"
          colSpan={!status ? 7 : 2}
          className="px-6 py-4 font-semibold w-1 text-right text-gray-900 whitespace-nowrap dark:text-gray-300 transition-all"
        >
          <Link
            prefetch={false}
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
