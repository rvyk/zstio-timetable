import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type MessageType = "INFO" | "UPDATE" | "WARNING" | "ERROR" | "SILENT";
type MessageTypeDisplay = "POPUP" | "BANNER";

type TimeRange = {
  from: string;
  to: string;
};

type Message = {
  id: string;
  message?: string;
  published: boolean;
  date: Date;
  type: MessageType;
  displayType: MessageTypeDisplay;
  toUrl?: string;
  redirectUrl?: string;
  displayTime?: TimeRange;
};

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

export default function Messages() {
  const [message, setMessage] = useState<Message | null>();
  const [bannerShowed, setShowBanner] = useState(false);

  const pathname = usePathname();

  const mapMessages = useCallback(
    (message: Message) => {
      const isMessagePublished = message.published;
      const isMessageForCurrentPath =
        message.toUrl === pathname || message.toUrl === null;

      if (isMessagePublished && isMessageForCurrentPath) {
        if (localStorage.getItem(message.id)) return;
        setShowBanner(true);
        return message;
      }
      return null;
    },
    [pathname],
  );

  const fetchMessage = useCallback(async () => {
    try {
      const res = await axios.get("/proxy/cms/messages");
      const { messages } = res.data;

      const message = messages.find(mapMessages);
      setMessage(message || null);
    } catch (error) {
      console.error(error);
    }
  }, [mapMessages]);

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
              Przejdź <ArrowRightIcon className="w-3 h-3 ms-2 rtl:rotate-180" />
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
