import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Jumbotron() {
  const pathname = usePathname();
  const isSubstitution = pathname === "/zastepstwa";

  return (
    <div className="py-8 relative px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <div className="flex justify-center items-center mb-4 md:mb-0 -ml-0 md:-ml-16">
        <Link
          prefetch={false}
          href={"https://zstiojar.edu.pl"}
          className="relative w-20 h-20 mr-4 hidden md:block z-30"
        >
          <Image
            alt="logo"
            src={"/icon-192x192.png"}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </Link>
        <h1 className="transition-all text-5xl font-bold tracking-tight leading-none text-[#2B161B] md:text-5xl lg:text-6xl dark:text-gray-100">
          {isSubstitution ? "Zastępstwa " : "Plan lekcji "}{" "}
          <span className="font-extrabold">ZSTiO</span>
        </h1>
      </div>
    </div>
  );
}

export default Jumbotron;
