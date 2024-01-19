import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";
import SettingsProvider from "../components/setting-context";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <TooltipProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <SettingsProvider>
          <Component {...pageProps} />
        </SettingsProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
};

export default App;
