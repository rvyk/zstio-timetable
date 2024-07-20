"use client";

import {
  RenderSubstitutions,
  RenderSubstitutionsMobile,
} from "@/components/content-items/substitutions/render-substitutions";
import { TimetableContext } from "@/components/timetable-provider";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import SubstitutionsBottomBar from "../substitutions-bottom-bar";

export const parseBranchField = (branch: string): string => {
  const regex = /(\w+)\|([^+]+)/g;
  let result = branch.replace(regex, "$1 ($2)");
  result = result.replace(/\+/g, " + ");
  return result.trim();
};

const Substitutions: React.FC = () => {
  const optivumTimetable = useContext(TimetableContext);
  const queryParams = useSearchParams();
  const branches = queryParams.get("branches")?.split(",") || [];
  const teachers = queryParams.get("teachers")?.split(",") || [];

  return (
    <>
      <Head>
        {queryParams.getAll("branches").length ||
          (queryParams.getAll("teachers").length && (
            <link
              rel="canonical"
              href="https://plan.zstiojar.edu.pl/zastepstwa"
            />
          ))}
      </Head>
      <>
        {optivumTimetable?.substitutions?.tables?.length ? (
          optivumTimetable?.substitutions?.tables.map(
            (table: SubstitutionTable, index: number) => {
              const filteredSubstitutions = table.zastepstwa.filter(
                (substitution: Substitution) =>
                  (branches.length === 0 ||
                    branches.includes(substitution.branch)) &&
                  (teachers.length === 0 ||
                    teachers.includes(substitution.teacher)),
              );

              return (
                <div key={index}>
                  <div className="hidden md:block">
                    <RenderSubstitutions
                      index={index}
                      filteredSubstitutions={filteredSubstitutions}
                      time={table.time}
                    />
                  </div>
                  <div className="block md:hidden">
                    <RenderSubstitutionsMobile
                      index={index}
                      filteredSubstitutions={filteredSubstitutions}
                      time={table.time}
                    />
                    <SubstitutionsBottomBar
                      substitutions={optivumTimetable.substitutions}
                    />
                  </div>
                </div>
              );
            },
          )
        ) : (
          <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center text-center md:mb-16 md:hidden md:h-fit">
            <p className="text-xl font-bold text-gray-500 transition-all dark:text-gray-200">
              {optivumTimetable?.substitutions.heading}
            </p>
          </div>
        )}
      </>
    </>
  );
};

export default Substitutions;
