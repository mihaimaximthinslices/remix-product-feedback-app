import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Form, Link, NavLink } from "@remix-run/react";

export default function NavBarMenu({ isLogged }: { isLogged: boolean }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center cursor-default outline-none focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-colors-s-color-1"
          aria-label="Update dimensions"
        >
          <DotsHorizontalIcon className="text-text1 hover:text-mainActionHover w-6 h-6 font-bold cursor-pointer" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="mt-[2.5px] md:mt-[6px] min-w-[100px] rounded-b-md ml-2 focus:outline-none focus:shadow-none bg-navbar1"
          sideOffset={5}
        >
          <ul className="w-full flex flex-col rounded-b-md divide-y shadow-sm">
            {!isLogged && (
              <NavLink
                className={({ isActive, isPending }) =>
                  `text-heading4 text-text1 hover:text-mainActionHover ${
                    isPending ? " pending" : isActive ? " underline" : ""
                  }`
                }
                to={"/sign-in"}
              >
                <li className="p-2">Sign in</li>
              </NavLink>
            )}
            {!isLogged && (
              <NavLink
                className={({ isActive, isPending }) =>
                  `text-heading4 text-text1 hover:text-mainActionHover ${
                    isPending ? " pending" : isActive ? " underline" : ""
                  }`
                }
                to={"/sign-up"}
              >
                <li className="p-2 rounded-b-md">Sign up</li>
              </NavLink>
            )}
            {isLogged && (
              <NavLink
                className={({ isActive, isPending }) =>
                  `text-heading4 text-text1 hover:text-mainActionHover ${
                    isPending ? " pending" : isActive ? " underline" : ""
                  }`
                }
                to={"/my-product-boards"}
              >
                <li className="p-2 rounded-b-md">My Product Boards</li>
              </NavLink>
            )}
            {isLogged && (
              <NavLink
                className={({ isActive, isPending }) =>
                  `text-heading4 text-text1 hover:text-mainActionHover ${
                    isPending ? " pending" : isActive ? " underline" : ""
                  }`
                }
                to={"/profile"}
              >
                <li className="p-2 rounded-b-md">Profile</li>
              </NavLink>
            )}
            {isLogged && (
              <Form method="POST">
                <button
                  type="submit"
                  className="text-heading4 text-text1 hover:text-mainActionHover"
                >
                  <li className="p-2 rounded-b-md">Sign out</li>
                </button>
              </Form>
            )}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
