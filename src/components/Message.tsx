import axios from "axios";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ReadMessageType = {
  INFO: "Informacja",
  UPDATE: "Aktualizacja",
  WARNING: "Uwaga",
  ERROR: "Błąd",
  SILENT: "🤫",
};

export default function Message() {
  const [message, setMessage] = useState<Message>();
  const pathname = usePathname();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get("/proxy/cms/messages");

        setMessage(
          (res?.data?.messages as any[]).map((message: Message) => {
            if (
              (message.published && message.toUrl === null) ||
              message.toUrl === pathname
            ) {
              return message;
            }
          })[0]
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessage();
  }, [pathname]);

  if (!message) return;

  return (
    <div
      id="baner"
      className="z-50 flex flex-col justify-between w-full p-4 border-b border-gray-200 md:flex-row bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
    >
      <div className="mb-4 md:mb-0 md:me-4">
        <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
          {ReadMessageType[message?.type]}
        </h2>
        <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
          {message?.message}
        </p>
      </div>
      <div className="flex items-center flex-shrink-0">
        {!!message?.redirectUrl && (
          <a
            href={message?.redirectUrl}
            className="inline-flex items-center justify-center px-3 py-2 me-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Get started{" "}
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
        <button
          data-dismiss-target="#baner"
          type="button"
          className="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close banner</span>
        </button>
      </div>
    </div>
  );
}
