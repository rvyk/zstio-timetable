import React, { useEffect } from "react";
import { initFlowbite } from "flowbite";

function Layout({ children }) {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-[#171717] transition-all">
      {children}
    </div>
  );
}

export default Layout;
