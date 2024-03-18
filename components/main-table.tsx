"use client";

import { Footer } from "@/components/footer";
import { TimetableContext } from "@/components/providers/timetable-provider";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useMediaQuery from "@/lib/mediaquery-hook";
import { cn, days } from "@/lib/utils";
import Link from "next/link";
import { Fragment, useContext } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export function MainTable() {
  const table = useContext(TimetableContext);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (!table) return null;
  const maxLessons = Math.max(Object.entries(table.hours).length, ...table.lessons.map((day) => day.length));
  return (
    <>
      <article className="flex-1">
        {/*TODO: mobile layout, currently a placeholder*/}
        {!isDesktop && (
          <>
            <header className="flex items-center justify-between gap-3 p-3">
              <Button variant="outline" size="iconLg" aria-label="Previous">
                <FaChevronLeft />
              </Button>
              <div className="flex h-14 flex-1 items-center gap-5 rounded-lg border px-4 text-left">
                <div className="text-xl font-bold">{new Date().getDay()}</div>
                <div className="grid">
                  <span className="font-medium capitalize">{days[0].long}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">Dzień kebsa</span>
                </div>
              </div>
              <Button variant="outline" size="iconLg" aria-label="Next">
                <FaChevronRight />
              </Button>
            </header>
            <section className="flex flex-wrap border-t">
              {Array.from({ length: 10 }).map((_, index) => (
                <Fragment key={index}>
                  <div className="flex basis-2/6 items-center justify-center gap-3 border-b border-r p-3 text-muted-foreground">
                    <span className="text-xl font-semibold">{index + 1}</span>
                    <span className="text-xs font-medium">8:00 - 8:45</span>
                  </div>
                  <div className="flex basis-4/6 items-center justify-between border-b p-3">
                    <div className="grid text-left">
                      <span className="font-semibold">Matematyka</span>
                      <span className="text-muted-foreground">Wł</span>
                    </div>
                    <span className="text-xl font-medium text-muted-foreground">W12</span>
                  </div>
                </Fragment>
              ))}
              <div className="p-3 text-muted-foreground">
                <Link href="https://www.zstio-elektronika.pl/plan/plany/o1.html">Data source</Link>
              </div>
            </section>
          </>
        )}
        {isDesktop && (
          <Table>
            <TableCaption>
              <Link href="https://www.zstio-elektronika.pl/plan/plany/o1.html">Data source</Link>
            </TableCaption>
            <>
              <TableHeader>
                <tr className="h-8">
                  <th></th> {/*DO NOT REMOVE*/}
                  {table.dayNames.map((day, index) => {
                    const today = new Date();
                    let lastMonday = new Date(today);

                    lastMonday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

                    if (today.getDay() === 6 || today.getDay() === 0) {
                      lastMonday.setDate(lastMonday.getDate() + 7);
                    }
                    return (
                      <th key={index} className="border-x px-8 last:border-r-0">
                        <div className="flex items-center gap-5 text-left">
                          <div
                            className={cn(
                              "text-xl font-bold",
                              lastMonday.getDate() + index === today.getDate() && "rounded-xl bg-accent px-3 py-2 ",
                            )}
                          >
                            {(lastMonday.getDate() + index).toString().padStart(2, "0")}
                          </div>
                          <div className="grid">
                            <span className="capitalize">{day}</span>
                            <span className="line-clamp-1 font-normal text-muted-foreground">{"todo"}</span>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </TableHeader>
              <TableBody>
                {Array.from({ length: maxLessons }).map((_, lessonIndex) => (
                  <TableRow key={lessonIndex}>
                    <TableHead>
                      <div className="flex items-center justify-center gap-5 text-nowrap">
                        <span className="text-xl font-bold">{lessonIndex + 1}</span>
                        <span className="text-sm font-medium text-muted-foreground">8:00 - 8:45</span>
                      </div>
                    </TableHead>
                    {table.lessons.map((day, dayIndex) => {
                      const lessonCell = day[lessonIndex];
                      if (lessonCell.length === 1)
                        return (
                          <TableCell key={`${dayIndex}-${lessonIndex}`} className="!px-6 !py-7">
                            <div
                              className="flex items-center justify-between gap-5 text-nowrap"
                              key={`${dayIndex}-${lessonIndex}-0`}
                            >
                              <span className="grid text-left">
                                <span className="font-medium">{lessonCell[0].subject}</span>
                                <span className="text-muted-foreground">{lessonCell[0].teacher}</span>
                              </span>
                              <span className="text-xl font-semibold">{lessonCell[0].room}</span>
                            </div>
                          </TableCell>
                        );
                      if (lessonCell.length === 2)
                        return (
                          <TableCell key={`${dayIndex}-${lessonIndex}`} className="!px-6 !py-7">
                            <div className="flex flex-row justify-between gap-10">
                              {lessonCell.map((subLesson, subLessonIndex) => (
                                <div
                                  className="flex items-center justify-between text-nowrap"
                                  key={`${dayIndex}-${lessonIndex}-${subLessonIndex}`}
                                >
                                  <div className="inline-flex items-center justify-center gap-1">
                                    <span className="text-xl font-semibold">
                                      {subLesson.groupName?.split("/")[0] ?? subLesson.groupName}
                                    </span>
                                    <span className="flex flex-col text-left">
                                      <span className="font-medium">{subLesson.subject}</span>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">{subLesson.teacher}</span>
                                        <span className="text-muted-foreground">{subLesson.room}</span>
                                      </div>
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        );
                      return <TableCell key={`${dayIndex}-${lessonIndex}`}></TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </>
          </Table>
        )}
      </article>
      <Footer className="max-sm:hidden" />
    </>
  );
}
