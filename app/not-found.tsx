"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FaCircleXmark as X } from "react-icons/fa6";

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center p-5 text-center">
      <X className="mb-2 h-10 w-10 text-muted-foreground" />
      <h1 className="text-8xl font-bold">404</h1>
      <h2 className="mb-2 text-2xl">Not Found</h2>
      <Link className={buttonVariants()} href="/">
        Go back
      </Link>
    </main>
  );
}
