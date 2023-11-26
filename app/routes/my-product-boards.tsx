import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSession } from "~/sessions.server";
import { Link } from "@remix-run/react";
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("email")) {
    return redirect("/sign-in");
  }

  return null;
}
export default function MyProductBoards() {
  return (
    <section className="flex flex-wrap gap-2 p-4">
      <AddProductBoardCard />
    </section>
  );
}

const AddProductBoardCard = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-white rounded-md shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-mainAction"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="mt-2 text-headingText1 text-heading3 font-bold">
          Add a product
        </h2>
        <p className="text-body1 text-text1">
          Create a new product feedback board
        </p>

        <Link
          to={"/my-product-boards/create"}
          className="px-4 py-2 mt-4 text-heading4 font-bold text-white bg-mainAction hover:bg-mainActionHover rounded-md"
        >
          Create board
        </Link>
      </div>
    </div>
  );
};
