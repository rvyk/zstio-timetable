import { isTimetablePath } from "@/lib/lastVisited";

export const SAVED_AT_HEADER = "x-saved-at";

export const SAVED_AT_ATTRIBUTE = "data-saved-at";

export const START_PATH_MESSAGE = "START_PATH";

export const REFRESH_PAGES_MESSAGE = "REFRESH_PAGES";

export const isSavedPage = (pathname: string) =>
  isTimetablePath(pathname) || pathname === "/free-rooms";
