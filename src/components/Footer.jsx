import React from "react";
function Footer() {
  return (
    <footer className="rounded-lg shadow m-4 w-[90%] sm:w-auto dark:bg-gray-800 transition-all bg-[#2B161B]">
      <div className="max-w-screen mx-auto p-4 transition-all">
        <span className="text-sm text-[#ffffff] block text-center dark:text-gray-400">
          © {new Date().getFullYear()}
          <span className="ml-1 font-roboto tracking-wide">
            Made with ❤️ in Dziurosław by
          </span>
          <a href="https://awfulworld.space/" className="hover:underline ml-1">
            awfulworld
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
