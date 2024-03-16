import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { days } from "@/lib/utils";
import Link from "next/link";
import { Fragment } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export function MainTable() {
    return (
        <>
            <article className="flex-1">
                <header className="flex items-center justify-between gap-3 p-3">
                    <Button variant="outline" size="iconLg">
                        <FaChevronLeft />
                    </Button>
                    <div className="flex h-14 flex-1 items-center gap-5 rounded-lg border px-4 text-left">
                        <div className="text-xl font-bold">{new Date().getDay()}</div>
                        <div className="grid">
                            <span className="font-medium capitalize">{days[0].long}</span>
                            <span className="line-clamp-1 text-xs text-muted-foreground">Dzień kebsa</span>
                        </div>
                    </div>
                    <Button variant="outline" size="iconLg">
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
                                <div className="grid">
                                    <span className="font-medium">Matematyka</span>
                                    <span className="text-xs text-muted-foreground">Wł</span>
                                </div>
                                <span className="text-xl font-semibold">W12</span>
                            </div>
                        </Fragment>
                    ))}
                    <div className="p-3 text-muted-foreground">
                        <Link href="https://www.zstio-elektronika.pl/plan/plany/o1.html">Data source</Link>
                    </div>
                </section>
                {false && (
                    <Table>
                        <TableCaption>
                            <Link href="https://www.zstio-elektronika.pl/plan/plany/o1.html">Data source</Link>
                        </TableCaption>
                        <>
                            <TableHeader>
                                <tr className="h-8">
                                    <th></th>
                                    {days.map((day) => {
                                        const currentDate = new Date();
                                        const nextDay = new Date(currentDate);
                                        nextDay.setDate(currentDate.getDate() + day.index);
                                        return (
                                            <th key={day.index} className="border-x px-8 last:border-r-0">
                                                <div className="flex items-center gap-5 text-left">
                                                    <div className="text-xl font-bold">{nextDay.getDate()}</div>
                                                    <div className="grid">
                                                        <span className="capitalize">{day.long}</span>
                                                        <span className="line-clamp-1 font-normal text-muted-foreground">
                                                            Dzień kebsa
                                                        </span>
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableHead>
                                            <div className="flex items-center justify-center gap-5 text-nowrap font-semibold">
                                                <span className="text-xl">{index + 1}</span>
                                                <span className="text-xs text-muted-foreground">8:00 - 8:45</span>
                                            </div>
                                        </TableHead>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <TableCell key={index}>
                                                <div className="flex items-center justify-between gap-5 text-nowrap">
                                                    <span className="grid text-left">
                                                        <span className="font-medium">Matematyka</span>
                                                        <span className="text-muted-foreground">Wł</span>
                                                    </span>
                                                    <span className="text-xl font-semibold">W12</span>
                                                </div>
                                            </TableCell>
                                        ))}
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
