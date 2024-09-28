"use client";

import { cn, parseSubstitutionClass, sortSubstitutions } from "@/lib/utils";
import { useSubstitutionsStore } from "@/stores/substitutions-store";
import {
  Substitution,
  SubstitutionTable as SubstitutionTableType,
  SubstitutionsPage,
} from "@majusss/substitutions-parser/dist/types";
import { FC } from "react";

const headers = [
  "Lekcja",
  "Oddział",
  "Przedmiot",
  "Nauczyciel",
  "Sala",
  "Uwagi",
  "Zastępca",
];

const TableHeader: FC = () => (
  <thead>
    <tr className="divide-x divide-lines border-b border-lines">
      {headers.map((header) => (
        <th key={header} className="relative px-4 py-3 text-center">
          <h3 className="text-lg font-semibold text-primary/90">{header}</h3>
        </th>
      ))}
    </tr>
  </thead>
);

const SubstitutionTable: FC<{
  table: SubstitutionTableType;
}> = ({ table }) => {
  const { filters } = useSubstitutionsStore();

  const filteredSubstitutions = sortSubstitutions(table.substitutions).filter(
    (substitution) => {
      const classMatch =
        filters.class.length === 0 ||
        filters.class.some((item) => item.name === substitution.class);

      const teacherMatch =
        filters.teacher.length === 0 ||
        filters.teacher.some((item) => item.name === substitution.teacher);

      return classMatch && teacherMatch;
    },
  );

  return (
    <table className="w-full">
      <caption className="border-b border-lines bg-accent/50 p-4 text-left text-lg font-semibold text-primary/90 dark:bg-background dark:font-medium">
        {table.time}
      </caption>
      <TableHeader />
      <tbody>
        {filteredSubstitutions.map((substitution, index) => (
          <SubstitutionRow key={index} substitution={substitution} />
        ))}
      </tbody>
    </table>
  );
};

export const Substitutions: FC<{ substitutions: SubstitutionsPage }> = ({
  substitutions,
}) => {
  return (
    <div className="h-fit w-full overflow-hidden rounded-md border border-lines bg-foreground transition-all">
      <div className="h-full w-full overflow-auto">
        {substitutions.tables.map((table, index) => (
          <SubstitutionTable key={index} table={table} />
        ))}
      </div>
    </div>
  );
};

const SubstitutionRow: FC<{
  substitution: Substitution;
}> = ({ substitution }) => {
  const cellClassName =
    "px-4 py-3 text-base font-medium text-primary/90 last:border-0";

  return (
    <tr className="divide-x divide-lines border-b border-lines last:border-none odd:bg-accent/50 odd:dark:bg-background">
      <td className="relative px-4 py-3 text-center">
        <h2 className="text-xl font-semibold text-primary/90">
          {substitution.number}
        </h2>
        <p className="whitespace-nowrap text-sm font-medium text-primary/70">
          {substitution.timeRange}
        </p>
      </td>
      <td className={cn("whitespace-nowrap", cellClassName)}>
        {parseSubstitutionClass(substitution.class)}
      </td>
      <td className={cellClassName}>{substitution.subject}</td>
      <td className={cellClassName}>{substitution.teacher}</td>
      <td className={cellClassName}>{substitution.room}</td>
      <td className={cellClassName}>{substitution.case}</td>
      <td className={cellClassName}>
        {substitution.lessonSubstitute?.map((lessonSubstitute, index) => (
          <div key={`${lessonSubstitute.subject}-${index}`}>
            {lessonSubstitute.subject}
            {lessonSubstitute.groupName
              ? `-${lessonSubstitute.groupName}`
              : ""}{" "}
            {lessonSubstitute.teacher} {lessonSubstitute.room}
          </div>
        ))}
      </td>
    </tr>
  );
};
