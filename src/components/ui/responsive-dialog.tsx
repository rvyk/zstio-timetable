"use client";

import useMediaQuery from "@/lib/useMediaQueryClient";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const ResponsiveDialog: React.FC<
  DialogProps | React.ComponentProps<typeof DrawerPrimitive.Root>
> = (props) => {
  if (useMediaQuery("(min-width: 768px)")) {
    return <Dialog {...props}>{props?.children}</Dialog>;
  }
  return <Drawer {...props}>{props?.children}</Drawer>;
};

const ResponsiveDialogClose: React.FC<
  DialogPrimitive.DialogCloseProps & React.RefAttributes<HTMLButtonElement>
> = (props) => {
  if (useMediaQuery("(min-width: 768px)")) {
    return <DialogClose {...props}>{props?.children}</DialogClose>;
  }
  return <DrawerClose {...props}>{props?.children}</DrawerClose>;
};

const ResponsiveDialogContent: React.FC<
  | React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
  | React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
> = (props) => {
  if (useMediaQuery("(min-width: 768px)")) {
    return <DialogContent {...props}>{props?.children}</DialogContent>;
  }
  return (
    <DrawerContent
      {...props}
      onAnimationEnd={(open) => {
        return open;
      }}
    >
      {props?.children}
    </DrawerContent>
  );
};

const ResponsiveDialogDescription: React.FC<
  | React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
  | React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
> = (props) => {
  if (useMediaQuery("(min-width: 768px)")) {
    return <DialogDescription {...props}>{props?.children}</DialogDescription>;
  }
  return <DrawerDescription {...props}>{props?.children}</DrawerDescription>;
};

const ResponsiveDialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  if (useMediaQuery("(min-width: 768px)")) {
    return <DialogFooter {...props}>{props?.children}</DialogFooter>;
  }
  return (
    <DrawerFooter className="flex-col-reverse" {...props}>
      {props?.children}
    </DrawerFooter>
  );
};

const ResponsiveDialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  if (useMediaQuery("(min-width: 768px)")) {
    return <DialogHeader {...props}>{props?.children}</DialogHeader>;
  }
  return <DrawerHeader {...props}>{props?.children}</DrawerHeader>;
};

const ResponsiveDialogTitle: React.FC<
  | React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
  | React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
> = (props) => {
  if (useMediaQuery("(min-width: 768px)")) {
    return <DialogTitle {...props}>{props?.children}</DialogTitle>;
  }
  return <DrawerTitle {...props}>{props?.children}</DrawerTitle>;
};

const ResponsiveDialogTrigger: React.FC<
  DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>
> = (props) => {
  if (useMediaQuery("(min-width: 768px)")) {
    return <DialogTrigger {...props}>{props?.children}</DialogTrigger>;
  }
  return <DrawerTrigger {...props}>{props?.children}</DrawerTrigger>;
};

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
