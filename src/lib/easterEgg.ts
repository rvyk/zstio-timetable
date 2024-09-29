import { Dispatch, KeyboardEvent, SetStateAction } from "react";

const calculateHash = async (text: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const searchHandleKeyDown = async (
  e: KeyboardEvent<HTMLInputElement>,
  setShowEasterEgg: Dispatch<SetStateAction<boolean>>,
) => {
  if (e.key === "Enter") {
    const input = e.currentTarget.value;
    const targetHash =
      "542bcfea6d679456c73c545f17c7f7beeac763a68157eff4d3291473348b6d5c";
    const inputHash = await calculateHash(input);

    if (inputHash === targetHash) {
      setShowEasterEgg(true);
    }
  }
};
