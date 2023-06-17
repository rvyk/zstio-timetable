import React from "react";

function Layout({ children }) {
  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-gray-900 transition-all">
      {children}
    </div>
  );
}

export default Layout;
