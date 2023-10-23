export default function RenderTableHeader({ day }) {
  const daysOfWeek = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];

  return (
    <thead className="text-xs transition-all duration-200 text-[#ffffff] bg-[#2B161B] uppercase dark:bg-[#151515] dark:text-gray-300">
      <tr>
        <th scope="col" className="px-6 py-3">
          <div className="flex items-center justify-center">Lekcja</div>
        </th>
        <th scope="col" className="px-8 py-3">
          <div className="flex items-center justify-center">Godz.</div>
        </th>
        {daysOfWeek.map((day) => (
          <th scope="col" className="px-6 py-3" key={day}>
            <div className="flex items-center justify-center">{day}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
