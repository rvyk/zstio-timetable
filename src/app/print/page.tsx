"use client";

import { useTimetableStore } from "@/stores/timetable";
import { TableHour, TableLesson } from "@majusss/timetable-parser";
import { ArrowLeftIcon, PrinterIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

type TemplateType = "classic" | "modern";

export default function PrintPage() {
  const { timetable } = useTimetableStore();
  const [template, setTemplate] = useState<TemplateType>("classic");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-background w-full" />;
  }

  if (!timetable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 w-full">
        <h1 className="text-xl font-medium">Brak danych planu lekcji</h1>
        <p className="text-muted-foreground">Wróć na stronę główną, aby wczytać plan.</p>
        <Button variant="secondary" onClick={() => window.close()}>
          <ArrowLeftIcon className="mr-2 size-4" /> Zamknij
        </Button>
      </div>
    );
  }

  const { title, dayNames, hours, lessons } = timetable;
  const days = dayNames || ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
  const hourKeys = Object.keys(hours || {}).map(Number);
  const maxHours = hourKeys.length > 0 ? Math.max(...hourKeys) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Controls - Hidden when printing */}
      <div className="print:hidden flex w-full items-center justify-between gap-4 p-4 md:px-8 md:pt-6 mb-4">
        <div className="flex items-center gap-x-4">
          <Button variant="icon" size="icon" onClick={() => window.close()}>
            <ArrowLeftIcon className="size-5" />
          </Button>
          <h1 className="text-primary/90 text-xl sm:text-2xl font-semibold">
            Wydruk planu lekcji
          </h1>
        </div>

        <div className="flex items-center gap-x-4">
          <div className="hidden sm:flex bg-primary/5 rounded-lg p-1 border border-primary/10">
            <button
              onClick={() => setTemplate("classic")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                template === "classic" ? "bg-background shadow-sm text-primary" : "text-primary/70 hover:text-primary"
              }`}
            >
              Klasyczny
            </button>
            <button
              onClick={() => setTemplate("modern")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                template === "modern" ? "bg-background shadow-sm text-primary" : "text-primary/70 hover:text-primary"
              }`}
            >
              Nowoczesny
            </button>
          </div>
          <Button onClick={handlePrint} className="gap-x-2">
            <PrinterIcon className="size-4" />
            <span className="hidden sm:inline">Drukuj</span>
          </Button>
        </div>
      </div>

      {/* Mobile template switcher */}
      <div className="sm:hidden print:hidden px-4 mb-6 flex justify-center">
        <div className="flex w-full bg-primary/5 rounded-lg p-1 border border-primary/10">
          <button
            onClick={() => setTemplate("classic")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              template === "classic" ? "bg-background shadow-sm text-primary" : "text-primary/70 hover:text-primary"
            }`}
          >
            Klasyczny
          </button>
          <button
            onClick={() => setTemplate("modern")}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              template === "modern" ? "bg-background shadow-sm text-primary" : "text-primary/70 hover:text-primary"
            }`}
          >
            Nowoczesny
          </button>
        </div>
      </div>

      {/* Print Content */}
      <div className="print:p-0 p-4 sm:p-8 max-w-7xl mx-auto overflow-auto bg-white text-black print:text-black min-h-[297mm]">
        <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>

        {template === "classic" ? (
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-100">
                <th className="border border-gray-400 p-2 w-16">Nr</th>
                <th className="border border-gray-400 p-2 w-32">Godziny</th>
                {days.map((day) => (
                  <th key={day} className="border border-gray-400 p-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxHours }).map((_, hourIndex) => {
                const hourNum = hourIndex + 1;
                const hourData = hours[hourNum];
                if (!hourData) return null;

                return (
                  <tr key={hourNum}>
                    <td className="border border-gray-400 p-2 text-center font-medium">{hourNum}</td>
                    <td className="border border-gray-400 p-2 text-center whitespace-nowrap">
                      {hourData.timeFrom} - {hourData.timeTo}
                    </td>
                    {days.map((_, dayIndex) => {
                      const dayLessons = lessons?.[dayIndex]?.[hourIndex] || [];
                      return (
                        <td key={dayIndex} className="border border-gray-400 p-2 text-center align-top min-w-[120px]">
                          {dayLessons.map((lesson, idx) => (
                            <div key={idx} className={idx > 0 ? "mt-2 pt-2 border-t border-gray-200" : ""}>
                              <div className="font-semibold">{lesson.subject}</div>
                              <div className="text-xs text-gray-600">
                                {lesson.teacher && <span>{lesson.teacher} </span>}
                                {lesson.room && <span>s. {lesson.room}</span>}
                              </div>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col gap-6">
            {days.map((day, dayIndex) => {
              // Check if day has any lessons
              const hasLessons = Array.from({ length: maxHours }).some((_, hIndex) => {
                const l = lessons?.[dayIndex]?.[hIndex];
                return l && l.length > 0;
              });

              if (!hasLessons) return null;

              return (
                <div key={day} className="border-l-4 border-black print:border-black pl-4">
                  <h3 className="text-xl font-bold mb-3">{day}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: maxHours }).map((_, hourIndex) => {
                      const dayLessons = lessons?.[dayIndex]?.[hourIndex] || [];
                      if (dayLessons.length === 0) return null;
                      
                      const hourNum = hourIndex + 1;
                      const hourData = hours[hourNum];

                      return (
                        <div key={hourNum} className="border border-gray-300 rounded-lg p-3 shadow-sm bg-gray-50 print:bg-white print:shadow-none print:border-gray-400">
                          <div className="text-xs text-gray-500 font-medium mb-1">
                            Lekcja {hourNum} ({hourData?.timeFrom} - {hourData?.timeTo})
                          </div>
                          {dayLessons.map((lesson, idx) => (
                            <div key={idx} className={idx > 0 ? "mt-2 pt-2 border-t border-gray-200" : ""}>
                              <div className="font-bold text-sm">{lesson.subject}</div>
                              <div className="text-xs text-gray-700 mt-1 flex justify-between">
                                <span>{lesson.teacher}</span>
                                <span className="font-medium">{lesson.room}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Print specific styles to hide navigation and enforce colors */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .max-w-7xl {
            max-width: none !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-gray-400 {
            border-color: #9ca3af !important;
          }
          .print\\:border-black {
            border-color: black !important;
          }
          .print\\:p-0, .print\\:p-0 * {
            visibility: visible;
          }
          .print\\:p-0 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
