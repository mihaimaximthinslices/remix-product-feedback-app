import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLocation,
} from "@remix-run/react";

import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node"; // or cloudflare/deno

// @ts-ignore
import styles from "./tailwind.css";
import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { destroySession, getSession } from "~/sessions.server";
import { useLoaderData } from "react-router";
import NavBarMenu from "~/components/NavBarMenu";
import { MobileSearchBar } from "~/components/MobileSearchBar";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
export const meta: MetaFunction = () => {
  return [
    { title: "Very cool app | Remix" },
    {
      property: "og:title",
      content: "Very cool app",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  ];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  return json({
    islogged: session.has("email"),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function App() {
  const location = useLocation();

  const showNavbar =
    location.pathname !== "/sign-in" && location.pathname !== "/sign-up";

  return (
    <html>
      <head>
        <title>Hello</title>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-screen bg-background font-jost">
        {showNavbar && <NavBar />}
        <section className="flex flex-col grow w-full">
          <Outlet />
        </section>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function NavBar() {
  const { islogged } = useLoaderData() as { islogged: boolean };

  return (
    <nav className="flex gap-2 bg-navbar1 w-full p-4 h-12 md:h-14 text-white text-heading3 font-bold items-center justify-between shadow-sm">
      <div>left</div>

      <div className="flex">
        <MobileSearchBar />
        <NavBarMenu isLogged={islogged} />
      </div>
    </nav>
  );
}
