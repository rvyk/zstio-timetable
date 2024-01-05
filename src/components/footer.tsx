import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full">
      <div className="max-w-[40vw] mx-auto p-4 rounded-lg shadow m-4 dark:bg-[#202020] bg-[#2B161B]">
        <span className="text-sm text-[#ffffff] block text-center dark:text-gray-400">
          © {new Date().getFullYear()}
          <span className="ml-1 tracking-wide">
            Made with ❤️ for ZSTiO by Szymański Paweł & Majcher Kacper
            <br />
            <Link
              prefetch={false}
              target="_blank"
              href={"https://github.com/rvyk/zstio-timetable/"}
            >
              GitHub (GPLv3)
            </Link>
          </span>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
