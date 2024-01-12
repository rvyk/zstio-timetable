import { parseBranchField } from "@/components/content-items/substitutions/substitutions";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  ClipboardIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Filters: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const branches = queryParams.get("branches")?.split(",") || [];
  const teachers = queryParams.get("teachers")?.split(",") || [];
  const filterItems = [...branches, ...teachers].filter(Boolean);

  if (!filterItems.length) return null;

  return (
    <div className="flex items-center">
      <FunnelIcon className="mr-1 h-4 w-4" />
      <p className="mr-2">Filtry: </p>

      <CopyButton />
      <ClearFiltersButton />

      {filterItems.map((item, index) => (
        <span
          key={index}
          className="mr-2 inline-flex items-center rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800 transition-all dark:bg-red-100 dark:text-red-800"
        >
          {parseBranchField(item)}
        </span>
      ))}
    </div>
  );
};

const CopyButton: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.share) {
        await navigator.share({
          title: "Zastępstwa ZSTiO",
          url: window?.location?.href,
        });
        setIsCopied(true);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
      }
    } catch (error) {
      console.error("Błąd podczas udostępniania linku:", error);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <Button variant="filter" size="filter" onClick={handleCopy}>
      {isCopied ? (
        <CheckIcon className="h-5 w-5" />
      ) : (
        <ClipboardIcon className="h-5 w-5" />
      )}
    </Button>
  );
};

const ClearFiltersButton: React.FC = () => {
  const router = useRouter();

  const handleClearFilters = async () => {
    await router.replace("/zastepstwa", undefined, { shallow: true });
    router.reload();
  };

  return (
    <Button
      variant="filter"
      size="filter"
      onClick={handleClearFilters}
      className="bg-red-100 text-red-800 dark:bg-blue-100 dark:text-blue-800"
    >
      Wyczyść filtry
      <XMarkIcon className="ml-1 h-4 w-4" />
    </Button>
  );
};

export default Filters;
