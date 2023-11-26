import * as Popover from "@radix-ui/react-popover";
import { MagnifyingGlassIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import React from "react";

export function MobileSearchBar() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center cursor-default outline-none text-text1"
          aria-label="Update dimensions"
        >
          <MagnifyingGlassIcon className="text-text1 hover:text-mainActionHover w-6 h-6 cursor-pointer" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          onInteractOutside={(e) => e.preventDefault()}
          className="rounded-b-md w-full"
          sideOffset={5}
        >
          <div className="relative bg-black w-screen">
            <div className="absolute w-screen bg-navbar1 border-b border-border1 op h-12 md:h-14 -top-[45.6px] md:-top-[50px] flex items-center">
              <div className="flex w-full items-center">
                <div className="flex before:w-8 h-full items-center text-2xl after:w-4">
                  <Popover.Close>
                    <ArrowLeftIcon className="cursor-pointer w-6 h-6 text-text1 hover:text-mainActionHover" />
                  </Popover.Close>
                </div>
                <div className="flex grow pr-4 rounded-md">
                  <input
                    className="bg-background rounded-sm p-1 text-text1 w-full pl-2"
                    placeholder="Search product boards"
                  />
                </div>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
