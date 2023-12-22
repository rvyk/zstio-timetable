import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

const MessageType: {
  [key in MessageType]: {
    display: string;
    color: string;
  };
} = {
  INFO: {
    display: "Informacja",
    color: "bg-gray-100 dark:bg-[#212121] dark:text-gray-300",
  },
  WARNING: {
    display: "Ostrzeżenie",
    color: "bg-yellow-100 dark:bg-yellow-400",
  },
  ERROR: { display: "Błąd", color: "bg-red-100 dark:bg-red-400" },
  UPDATE: { display: "Aktualizacja", color: "bg-green-100 dark:bg-green-400" },
  SILENT: {
    display: "",
    color: "bg-gray-50 dark:bg-[#212121] dark:text-gray-300",
  },
};

export default function Message() {
  const [message, setMessage] = useState<Message>();
  const pathname = usePathname();
  const [bannerShowed, setShowBanner] = useState(false);

  const fetchMessage = useCallback(async () => {
    try {
      const res = await axios.get("/proxy/cms/messages");

      const mapMessages = (message: Message) => {
        const isMessagePublished = message.published;
        const isMessageForCurrentPath =
          message.toUrl === pathname || message.toUrl === null;

        if (isMessagePublished && isMessageForCurrentPath) {
          if (localStorage.getItem(message.id)) return;
          setShowBanner(true);
          return message;
        }
        return null;
      };

      const messages = (res.data.messages as Message[])
        .map(mapMessages)
        .filter(Boolean);
      setMessage(messages[0]);
    } catch (error) {
      console.error(error);
    }
  }, [pathname]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  if (!message) return;

  if (message.displayType == "BANNER") {
    return (
      <div
        className={`${
          bannerShowed ? "absolute" : "hidden"
        } top-0 left-0 z-50 flex flex-row justify-between w-full p-5 border-b border-gray-200 ${
          MessageType[message.type].color
        } dark:border-[#202020]`}
      >
        <div className="flex items-center mx-auto md:flex-row flex-col">
          <p className="flex items-center text-sm font-normal md:flex-row flex-col">
            <span className="font-bold">
              {MessageType[message.type].display}
            </span>
            <span className="text-center font-semibold mx-4 text-wrap">
              {message?.message}{" "}
            </span>
          </p>
          {!!message?.redirectUrl && (
            <a
              href={message?.redirectUrl}
              className="mt-2 md:mt-0 inline-flex ml-3 items-center justify-center px-3 py-2 me-2 text-xs font-medium text-white rounded-lg bg-[#321c21] hover:bg-[#480e0c] focus:ring-4 focus:ring-red-300 dark:hover:bg-red-500 dark:bg-red-400 transition-all focus:outline-none dark:focus:ring-red-800"
            >
              Przejdź{" "}
              <svg
                className="w-3 h-3 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          )}
        </div>
        <button
          onClick={() => {
            setShowBanner(false);
            localStorage.setItem(message.id, "readed");
            fetchMessage();
          }}
          className="border-0 bg-transparent "
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }
}
