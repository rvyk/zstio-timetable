"use client";

import { cn } from "@/lib/utils";
import {
  ComponentProps,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
} from "react";

const MIN_THUMB = 24;

interface ScrollAreaProps extends Omit<ComponentProps<"div">, "ref"> {
  viewportClassName?: string;
  contentClassName?: string;
  scrollbarClassName?: string;
}

export const ScrollArea = ({
  className,
  viewportClassName,
  contentClassName,
  scrollbarClassName,
  children,
  ...props
}: ScrollAreaProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!viewport || !content || !track || !thumb) return;

    const sync = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const scrollable = scrollHeight - clientHeight > 1;
      content.toggleAttribute("data-scrollable", scrollable);
      track.toggleAttribute("data-scrollable", scrollable);
      if (!scrollable) return;

      const room = track.clientHeight;
      const size = Math.max(MIN_THUMB, (clientHeight / scrollHeight) * room);
      const progress = scrollTop / (scrollHeight - clientHeight);
      thumb.style.height = `${size}px`;
      thumb.style.transform = `translateY(${progress * (room - size)}px)`;
    };

    const observer = new ResizeObserver(sync);
    observer.observe(viewport);
    observer.observe(content);
    viewport.addEventListener("scroll", sync, { passive: true });
    sync();

    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!viewport || !track || !thumb || event.button !== 0) return;

    event.preventDefault();
    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const onThumb = event.target === thumb;
    const grab = onThumb ? event.clientY - thumbRect.top : thumbRect.height / 2;
    const room = trackRect.height - thumbRect.height;
    const range = viewport.scrollHeight - viewport.clientHeight;

    const scrollTo = (clientY: number) =>
      viewport.scrollTo({
        top: ((clientY - trackRect.top - grab) / room) * range,
        behavior: "instant",
      });

    if (!onThumb) scrollTo(event.clientY);

    const onMove = (moveEvent: PointerEvent) => scrollTo(moveEvent.clientY);
    const stop = () => {
      track.removeEventListener("pointermove", onMove);
      track.removeAttribute("data-dragging");
    };

    track.setPointerCapture(event.pointerId);
    track.setAttribute("data-dragging", "");
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", stop, { once: true });
    track.addEventListener("pointercancel", stop, { once: true });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={viewportRef}
        className={cn("scrollbar-none overflow-y-auto", viewportClassName)}
        {...props}
      >
        <div ref={contentRef} className={contentClassName}>
          {children}
        </div>
      </div>
      <div
        ref={trackRef}
        aria-hidden
        onPointerDown={startDrag}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "group/bar invisible absolute top-1 right-0 bottom-1 w-3 touch-none select-none data-[scrollable]:visible",
          scrollbarClassName,
        )}
      >
        <div
          ref={thumbRef}
          className="bg-primary/20 group-hover/bar:bg-primary/35 group-data-[dragging]/bar:bg-primary/45 absolute inset-x-0 top-0 mx-auto w-1.5 rounded-full transition-colors duration-150"
        />
      </div>
    </div>
  );
};
