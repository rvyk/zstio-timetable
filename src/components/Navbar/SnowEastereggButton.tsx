import React from "react";

function SnowEastereggButton(
  {
    isSnowing,
    setIsSnowing,
  }: {
    isSnowing: boolean;
    setIsSnowing: React.Dispatch<React.SetStateAction<boolean>>;
  },
) {
  return (
    <div className="hidden lg:block">
      <button
        data-tooltip-id="navbar_tooltips"
        data-tooltip-content="Niech spadnie śnieg!"
        onClick={() => {
          setIsSnowing(!isSnowing);
          localStorage.setItem("isSnowing", isSnowing ? "false" : "true");
        }}
        className="flex transition-all items-center p-3 mr-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-dark-state-example hover:bg-[#321c21] hover:text-gray-100 focus:z-10 focus:ring-2 focus:ring-[#2B161B] dark:focus:ring-gray-500 dark:bg-[#202020] focus:outline-none dark:text-gray-200 dark:border-[#202020] dark:hover:border-[#171717] dark:hover:text-white dark:hover:bg-[#171717] lg:dark:hover:bg-[#141414]"
      >
        {isSnowing ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            className="h-4 w-4 transition-none"
            fill="currentColor"
          >
            <path d="M224 0c13.3 0 24 10.7 24 24V70.1l23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-57 57v76.5l66.2-38.2 20.9-77.8c3.4-12.8 16.6-20.4 29.4-17s20.4 16.6 17 29.4L373 142.2l37.1-21.4c11.5-6.6 26.2-2.7 32.8 8.8s2.7 26.2-8.8 32.8L397 183.8l31.5 8.4c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17l-77.8-20.9L272 256l66.2 38.2 77.8-20.9c12.8-3.4 26 4.2 29.4 17s-4.2 26-17 29.4L397 328.2l37.1 21.4c11.5 6.6 15.4 21.3 8.8 32.8s-21.3 15.4-32.8 8.8L373 369.8l8.4 31.5c3.4 12.8-4.2 26-17 29.4s-26-4.2-29.4-17l-20.9-77.8L248 297.6v76.5l57 57c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-23-23V488c0 13.3-10.7 24-24 24s-24-10.7-24-24V441.9l-23 23c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l57-57V297.6l-66.2 38.2-20.9 77.8c-3.4 12.8-16.6 20.4-29.4 17s-20.4-16.6-17-29.4L75 369.8 37.9 391.2c-11.5 6.6-26.2 2.7-32.8-8.8s-2.7-26.2 8.8-32.8L51 328.2l-31.5-8.4c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17l77.8 20.9L176 256l-66.2-38.2L31.9 238.6c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4L51 183.8 13.9 162.4c-11.5-6.6-15.4-21.3-8.8-32.8s21.3-15.4 32.8-8.8L75 142.2l-8.4-31.5c-3.4-12.8 4.2-26 17-29.4s26 4.2 29.4 17l20.9 77.8L200 214.4V137.9L143 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23V24c0-13.3 10.7-24 24-24z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            className="h-4 w-4 transition-none"
            fill="currentColor"
          >
            <path d="M341.1 140.6c-2 3.9-1.6 8.6 1.2 12c7 8.5 12.9 18.1 17.2 28.4L408 160.2V120c0-13.3 10.7-24 24-24s24 10.7 24 24v19.6l22.5-9.7c12.2-5.2 26.3 .4 31.5 12.6s-.4 26.3-12.6 31.5l-56 24-73.6 31.5c-.5 9.5-2.1 18.6-4.8 27.3c-1.2 3.8-.1 8 2.8 10.8C396.7 296.9 416 338.2 416 384c0 44.7-18.3 85-47.8 114.1c-9.9 9.7-23.7 13.9-37.5 13.9H181.3c-13.9 0-27.7-4.2-37.5-13.9C114.3 469 96 428.7 96 384c0-45.8 19.3-87.1 50.1-116.3c2.9-2.8 4-6.9 2.8-10.8c-2.7-8.7-4.3-17.9-4.8-27.3L70.5 198.1l-56-24C2.4 168.8-3.3 154.7 1.9 142.5s19.3-17.8 31.5-12.6L56 139.6V120c0-13.3 10.7-24 24-24s24 10.7 24 24v40.2L152.6 181c4.3-10.3 10.1-19.9 17.2-28.4c2.8-3.4 3.3-8.1 1.2-12C164 127.2 160 112.1 160 96c0-53 43-96 96-96s96 43 96 96c0 16.1-4 31.2-10.9 44.6zM224 96a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm48 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm-16 80a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm16 48a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM288 96a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm-48 24v3.2c0 3.2 .8 6.3 2.3 9l9 16.9c.9 1.7 2.7 2.8 4.7 2.8s3.8-1.1 4.7-2.8l9-16.9c1.5-2.8 2.3-5.9 2.3-9V120c0-8.8-7.2-16-16-16s-16 7.2-16 16z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default SnowEastereggButton;
