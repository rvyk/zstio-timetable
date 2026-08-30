"use client";

import {
  useLocale,
  useSetLocale,
  useT,
} from "@/components/common/LocaleProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { DialogDescription, DialogTitle } from "@/components/ui/Dialog";
import { Segmented } from "@/components/ui/Segmented";
import { usePwa } from "@/hooks/usePWA";
import { showErrorToast, toast } from "@/hooks/useToast";
import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { useTimetableStore } from "@/stores/timetable";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { LucideIcon } from "lucide-react";
import {
  AccessibilityIcon,
  CalendarArrowDownIcon,
  ChevronDown,
  DownloadIcon,
  PrinterIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useIsClient } from "usehooks-ts";

type SettingsItem = {
  key: string;
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  onClick?: () => void;
  href?: string;
  hidden?: boolean;
};

const SettingButton = ({
  icon: Icon,
  title,
  description,
  onClick,
  href,
  index = 0,
}: Omit<SettingsItem, "key" | "hidden"> & { index?: number }) => {
  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener" : undefined}
      onClick={onClick}
      style={{ animationDelay: `${60 + index * 35}ms` }}
      className={cn(
        "group animate-rise flex w-full gap-3 rounded-md p-2.5 text-left transition duration-150 max-md:min-h-11",
        "hover:bg-primary/4 active:scale-[0.99]",
      )}
    >
      <Icon
        className="text-primary/60 group-hover:text-accent-table mt-0.5 size-4 shrink-0 transition duration-200 group-hover:scale-110"
        strokeWidth={1.75}
      />
      <div className="grid gap-1">
        <h2 className="text-primary text-[13px] leading-none font-medium tracking-tight">
          {title}
        </h2>
        <div className="text-primary/55 text-[11px] leading-relaxed">
          {description}
        </div>
      </div>
    </Tag>
  );
};

const THEMES = [
  { value: "light", key: "theme.light" },
  { value: "dark", key: "theme.dark" },
  { value: "system", key: "theme.system" },
] as const;

const LANGUAGE_LABELS: Record<Locale, string> = {
  pl: "Polski",
  uk: "Українська",
};

const useThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const switchTheme = (value: string) => {
    const root = document.documentElement;
    root.dataset.themeInstant = "";
    flushSync(() => setTheme(value));
    void document.body.offsetHeight;
    delete root.dataset.themeInstant;
  };

  return { theme, switchTheme };
};

const ThemeSetting = () => {
  const translate = useT();
  const { theme, switchTheme } = useThemeSwitch();
  const isClient = useIsClient();

  return (
    <div className="grid gap-2 p-2.5">
      <span className="text-primary/55 text-[11px] font-medium tracking-[0.06em] uppercase">
        {translate("theme.label")}
      </span>
      <Segmented
        options={THEMES.map(({ value, key }) => ({
          value,
          label: translate(key),
        }))}
        value={isClient ? (theme ?? "system") : "system"}
        onSelect={switchTheme}
        buttonClassName="py-1.5 text-[11px] font-medium"
        keepTransition
      />
    </div>
  );
};

const LanguageSetting = () => {
  const translate = useT();
  const locale = useLocale();
  const setLocale = useSetLocale();

  return (
    <div className="grid gap-2 p-2.5">
      <span className="text-primary/55 text-[11px] font-medium tracking-[0.06em] uppercase">
        {translate("language.label")}
      </span>
      <Segmented
        options={LOCALES.map((option) => ({
          value: option,
          label: LANGUAGE_LABELS[option],
          lang: option,
        }))}
        value={locale}
        onSelect={setLocale}
        buttonClassName="py-1.5 text-[11px] font-medium"
        keepTransition
      />
    </div>
  );
};

const A11Y_OPTIONS = [
  { key: "text", label: "a11y.text", hint: "a11y.textHint" },
  { key: "contrast", label: "a11y.contrast", hint: "a11y.contrastHint" },
  { key: "motion", label: "a11y.motion", hint: "a11y.motionHint" },
] as const;

const AccessibilitySetting = ({ index = 0 }: { index?: number }) => {
  const translate = useT();
  const a11y = useSettingsStore((state) => state.a11y);
  const toggleA11y = useSettingsStore((state) => state.toggleA11y);
  const isClient = useIsClient();

  const activeCount = isClient
    ? A11Y_OPTIONS.filter((option) => a11y[option.key]).length
    : 0;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="a11y">
        <AccordionTrigger
          style={{ animationDelay: `${60 + index * 35}ms` }}
          className="group animate-rise hover:bg-primary/4 w-full items-start gap-3 rounded-md p-2.5 text-left transition duration-150 max-md:min-h-11"
        >
          <AccessibilityIcon
            className="text-primary group-hover:text-accent-table mt-0.5 size-4 shrink-0 opacity-60 transition duration-200 group-hover:scale-110"
            strokeWidth={1.75}
          />
          <span className="grid flex-1 gap-1">
            <span className="text-primary text-[13px] leading-none font-medium tracking-tight">
              {translate("a11y.label")}
            </span>
            <span className="text-primary text-[11px] leading-relaxed opacity-55">
              {activeCount > 0
                ? translate("a11y.active", { count: activeCount })
                : translate("a11y.summary")}
            </span>
          </span>
          <ChevronDown
            className="text-primary mt-0.5 size-3.5 shrink-0 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180"
            strokeWidth={2}
          />
        </AccordionTrigger>
        <AccordionContent contentClassName="mx-2 grid gap-0.5 pt-1">
          {A11Y_OPTIONS.map((option) => {
            const active = isClient && a11y[option.key];

            return (
              <button
                key={option.key}
                role="switch"
                aria-checked={active}
                onClick={() => toggleA11y(option.key)}
                className="hover:bg-primary/4 flex items-center gap-3 rounded-md p-2.5 text-left transition-colors max-md:min-h-11"
              >
                <span className="grid flex-1 gap-1">
                  <span className="text-primary text-[13px] leading-none font-medium tracking-tight">
                    {translate(option.label)}
                  </span>
                  <span className="text-primary/55 text-[11px] leading-relaxed">
                    {translate(option.hint)}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "border-lines relative h-5 w-8.5 shrink-0 rounded-full border transition-colors duration-200",
                    active ? "bg-accent-table border-transparent" : "bg-accent",
                  )}
                >
                  <span
                    className={cn(
                      "ease-out-quint absolute top-0.5 left-0.5 size-3.5 rounded-full transition-transform duration-200",
                      active
                        ? "translate-x-3.5 bg-white"
                        : "bg-primary/35 translate-x-0",
                    )}
                  />
                </span>
              </button>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const SettingsList = ({
  onSelect,
  includePrint,
}: {
  onSelect?: () => void;
  includePrint?: boolean;
}) => {
  const router = useRouter();
  const translate = useT();
  const timetable = useTimetableStore((state) => state.timetable);
  const [prompt, isInstalled] = usePwa();

  const settings = useMemo<SettingsItem[]>(
    () => [
      {
        key: "install",
        icon: DownloadIcon,
        title: translate("settings.install"),
        hidden: isInstalled,
        onClick: () => {
          if (prompt) {
            prompt.prompt();
            return;
          }

          showErrorToast(
            translate("settings.installError"),
            translate("settings.installErrorHint"),
          );
        },
        description: <p>{translate("settings.installHint")}</p>,
      },
      {
        key: "calendar",
        icon: CalendarArrowDownIcon,
        title: translate("settings.calendar"),
        onClick: async () => {
          if (!timetable?.id || !timetable.lessons?.length) {
            showErrorToast(
              translate("settings.calendarError"),
              translate("settings.calendarEmpty"),
            );
            return;
          }

          const url = `${window.location.origin}/api/calendar/${timetable.id}.ics`;

          try {
            await navigator.clipboard.writeText(url);
            toast({
              title: translate("settings.calendarCopied"),
              description: translate("settings.calendarCopiedHint"),
              icon: CalendarArrowDownIcon,
            });
          } catch {
            toast({
              title: translate("settings.calendarCopyFailed"),
              description: url,
              icon: CalendarArrowDownIcon,
            });
          }

          if (window.location.protocol !== "https:") return;

          const webcal = url.replace(/^https/, "webcal");

          if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
            window.location.href = webcal;
            return;
          }

          window.open(
            `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`,
            "_blank",
            "noopener",
          );
        },
        description: (
          <p>
            {translate("settings.calendarHint", {
              title: timetable?.title ?? "",
            })}
          </p>
        ),
      },
      {
        key: "print",
        icon: PrinterIcon,
        title: translate("settings.print"),
        hidden: !includePrint,
        href: "/print",
        description: <p>{translate("settings.printHint")}</p>,
      },
      {
        key: "freeRooms",
        icon: Search,
        title: translate("freeRooms.title"),
        hidden: timetable?.list.rooms?.length === 0,
        onClick: () => router.push("/free-rooms"),
        description: <p>{translate("settings.freeRoomsHint")}</p>,
      },
    ],
    [isInstalled, prompt, timetable, router, includePrint, translate],
  );

  const visibleSettings = settings.filter((setting) => !setting.hidden);

  return (
    <div className="grid gap-0.5 p-1">
      {visibleSettings.map(({ key, onClick, ...setting }, index) => (
        <SettingButton
          key={key}
          {...setting}
          index={index}
          onClick={() => {
            onClick?.();
            onSelect?.();
          }}
        />
      ))}
      <AccessibilitySetting index={visibleSettings.length} />
      <hr className="border-lines my-1" />
      <ThemeSetting />
      <LanguageSetting />
    </div>
  );
};

const useAnchor = (
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  isOpen: boolean,
) => {
  const [anchor, setAnchor] = useState({ top: 64, right: 12 });

  const measure = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchor({
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, [triggerRef]);

  useEffect(() => {
    if (!isOpen) return;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isOpen, measure]);

  return anchor;
};

export const SettingsMenu = () => {
  const translate = useT();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const anchor = useAnchor(triggerRef, isOpen);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          ref={triggerRef}
          aria-label={translate("settings.menuOpen")}
          className={cn(
            "border-lines bg-accent text-primary/80 active:bg-primary/5 active:text-primary grid size-11 place-content-center rounded-lg border transition duration-150 active:scale-90",
            "data-[state=open]:text-primary data-[state=open]:bg-foreground data-[state=open]:pointer-events-none data-[state=open]:relative data-[state=open]:z-120",
          )}
        >
          <SlidersHorizontal
            className="text-primary size-4.5 opacity-80"
            strokeWidth={2}
          />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out fixed inset-0 z-110 bg-black/45 backdrop-blur-xs md:hidden" />
        <DialogPrimitive.Content
          ref={contentRef}
          tabIndex={-1}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            contentRef.current?.focus();
          }}
          style={{ top: anchor.top, right: anchor.right }}
          className="border-lines bg-foreground data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out fixed z-110 grid max-h-[calc(100dvh-6rem)] w-[min(19rem,calc(100vw-4rem))] origin-top-right gap-4 overflow-y-auto rounded-xl border p-4 shadow-(--shadow-raised) md:hidden"
        >
          <VisuallyHidden>
            <DialogTitle>{translate("settings.menu")}</DialogTitle>
            <DialogDescription>
              {translate("settings.menuHint")}
            </DialogDescription>
          </VisuallyHidden>

          <div className="-mx-1.5">
            <SettingsList onSelect={() => setIsOpen(false)} includePrint />
          </div>

          <p className="border-lines text-primary/50 border-t pt-3 text-center text-[11px] leading-relaxed">
            © 2024 Made with ❤️ for ZSTiO by <br /> Szymański Paweł & Majcher
            Kacper <br />
            <Link
              className="hover:text-primary underline underline-offset-2 transition-colors"
              target="_blank"
              href="https://github.com/rvyk/zstio-timetable"
            >
              GitHub (GPLv3)
            </Link>
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
