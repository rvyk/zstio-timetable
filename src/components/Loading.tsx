import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

function Loading() {
  const [loadingText, setLoadingText] = useState("Wczytywanie planu");
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === "...") {
          return ".";
        } else {
          return prevDots + ".";
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoadingText(`Wczytywanie planu${dots}`);
  }, [dots]);
  return (
    <div
      role="status"
      className="my-4 transition-all text-xl w-full flex justify-center items-center text-gray-500 dark:text-gray-300"
    >
      <ArrowPathIcon className="w-7 h-7 lg:w-10 lg:h-10 mr-2 animate-spin" />
      <h1 className="lg:text-2xl ">{loadingText}</h1>
    </div>
  );
}

export default Loading;
