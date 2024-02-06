// @vitest-environment jsdom

import Layout from "@/components/layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { render } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { test } from "vitest";
import * as example from "./1TE-example.json";

test("Page", () => {
  render(
    <TooltipProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Layout props={example} />
      </ThemeProvider>
    </TooltipProvider>,
  );
});
