import { days } from "@/utils/helpers";

export default function RenderTableHeader() {
  return (
    <thead className="text-xs transition-all duration-200 text-[#ffffff] bg-[#2B161B] uppercase dark:bg-[#151515] dark:text-gray-300">
      <tr>
        <th scope="col" className="px-6 py-3">
          <div className="flex items-center justify-center">Lekcja</div>
        </th>
        <th scope="col" className="px-8 py-3">
          <div className="flex items-center justify-center">Godz.</div>
        </th>
        {days.map((day) => (
          <th scope="col" className="px-6 py-3" key={day.long}>
            <div className="flex items-center justify-center">{day.long}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
