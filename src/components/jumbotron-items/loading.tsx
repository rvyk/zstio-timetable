import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const Loading: React.FC = () => {
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
      <ReloadIcon className="w-5 h-5 lg:w-6 lg:h-6 mr-2 mt-1 animate-spin" />
      <h1 className="lg:text-2xl ">{loadingText}</h1>
    </div>
  );
};

export default Loading;
