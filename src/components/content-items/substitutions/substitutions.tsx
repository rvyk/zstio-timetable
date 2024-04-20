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
                      status={
                        optivumTimetable?.substitutions?.tables?.length > 0
                      }
                      time={table.time}
                    />
                  </div>
                  <div className="block md:hidden">
                    <RenderSubstitutionsMobile
                      index={index}
                      filteredSubstitutions={filteredSubstitutions}
                      status={
                        optivumTimetable?.substitutions?.tables?.length > 0
                      }
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
          <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center text-center md:mb-16 md:h-fit">
            <p className="font-bold">Brak zastepstwa</p>
            <p>{optivumTimetable?.substitutions?.timeRange}</p>
          </div>
        )}
      </>
    </>
  );
};

export default Substitutions;
