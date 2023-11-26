import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
  TypedResponse,
} from "@remix-run/node";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { getSession, commitSession } from "~/sessions.server";
import { userRepository } from "~/infrastructure/prisma/userRepository";
import { uuid, hash } from "~/utils.server";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email can t be empty")
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, " Password must be at most 20 characters long"),
  username: z
    .string()
    .min(8, "Username must be at least 8 characters long")
    .max(20, "Username must be at most 20 characters long")
    .refine(
      (value) => {
        const isValidFormat = /^[a-z0-9.]+$/.test(value);

        const isValidPosition = /^[^.].*[^.]$/.test(value);

        return isValidFormat && isValidPosition;
      },
      {
        message:
          "Username should contain only lowercase letters, numbers, and dots. Dots cannot be at the beginning or end.",
      }
    ),
});

type ActionResponse = {
  errors: {
    username?: string;
    password?: string;
    email?: string;
    other?: string;
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("email")) {
    return redirect("/");
  }

  return null;
}
export const action = async ({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<ActionResponse>> => {
  const session = await getSession(request.headers.get("Cookie"));

  const validator = withZod(formSchema);

  const { error, data } = await validator.validate(await request.formData());

  if (error) {
    return json({ errors: error.fieldErrors }, { status: 400 });
  }

  const { email, password, username } = data;

  const user = await userRepository.getByEmail(email);

  if (user) {
    return json(
      {
        errors: {
          other: "Account already exists",
        },
      },
      { status: 409 }
    );
  }

  const userByUsername = await userRepository.getByUsername(username);

  if (userByUsername) {
    return json(
      {
        errors: {
          other: "Username is taken",
        },
      },
      { status: 409 }
    );
  }

  const now = new Date();

  await userRepository.save({
    id: uuid(),
    email,
    password: await hash(password),
    username,
    status: "not_onboarded",
    authMethod: "credentials",
    avatar: null,
    createdAt: now,
    updatedAt: now,
  });

  session.set("email", email);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function SignUp() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [errors, setErrors] = useState<ActionResponse["errors"]>({});

  useEffect(() => {
    if (actionData?.errors) {
      setErrors(actionData.errors);
    }
  }, [actionData?.errors]);

  const navigation = useNavigation();
  const state = navigation.state;

  const isSubmitting = state === "submitting";

  return (
    <div className="flex h-full items-center justify-center">
      <Form
        className="p-4 bg-white shadow-sm rounded-md min-w-[310px]"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit(e.currentTarget);
          }
        }}
        method="post"
      >
        <fieldset disabled={isSubmitting} className="flex flex-col gap-2">
          <div className="flex gap-4 justify-between items-start">
            <label
              className="text-headingText1 font-bold text-heading4"
              htmlFor="email"
            >
              Email
            </label>
            <input
              placeholder="john.doe@email.com"
              name="email"
              className="bg-background rounded-sm p-1 text-text1 min-w-[200px] pl-2"
              onFocus={() => {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
          </div>
          {errors.email && !isSubmitting && (
            <span className="-mt-2 text-sm text-error1">{errors.email}</span>
          )}

          <div className="flex gap-4 justify-between items-start">
            <label
              className="text-headingText1 font-bold text-heading4"
              htmlFor="username"
            >
              Username
            </label>
            <input
              placeholder="john.doe10"
              name="username"
              className="bg-background rounded-sm p-1 text-text1 min-w-[200px] pl-2"
              type="text"
              onFocus={() => {
                setErrors((prev) => ({ ...prev, username: undefined }));
              }}
            />
          </div>
          {errors.username && !isSubmitting && (
            <span className="-mt-2 text-sm text-error1">{errors.username}</span>
          )}
          <div className="flex gap-4 justify-between items-start">
            <label
              className="text-headingText1 font-bold text-heading4"
              htmlFor="password"
            >
              Password
            </label>
            <input
              name="password"
              autoComplete="yes"
              placeholder="Your password"
              className="bg-background rounded-sm p-1 text-text1 min-w-[200px] pl-2"
              type="password"
              onFocus={() => {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
          </div>
          {errors.password && !isSubmitting && (
            <span className="-mt-2 text-sm text-error1">{errors.password}</span>
          )}

          {errors.other && !isSubmitting && (
            <span className="-mt-2 text-sm text-error1">{errors.other}</span>
          )}

          <button className="w-full bg-mainAction hover:bg-mainActionHover text-white p-2 rounded-sm mt-2">
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
          <hr className="border-gray2 mb-1 w-full mt-1 dark:border-black1" />
          <div className="flex flex-col items-center w-full gap-4">
            <a
              href=""
              data-cy="sign-in-with-google-button"
              className="bg-container1 hover:bg-container1Hover text-white w-full p-2 flex items-center justify-center gap-2 rounded-sm"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="21"
                  fill="none"
                >
                  <path
                    fill="#4285F4"
                    d="M19.869 11.109c0-.682-.057-1.362-.174-2.034H10.2v3.852h5.439a4.61 4.61 0 0 1-.693 1.723c-.346.523-.794.97-1.319 1.315v2.5h3.246c1.9-1.74 2.996-4.313 2.996-7.356Z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M10.2 20.88c2.717 0 5.005-.885 6.673-2.413l-3.246-2.5c-.903.608-2.067.955-3.427.955-2.627 0-4.856-1.758-5.653-4.127H1.203v2.576a10.026 10.026 0 0 0 3.712 4.021 10.121 10.121 0 0 0 5.285 1.489Z"
                  ></path>
                  <path
                    fill="#FBBC04"
                    d="M4.547 12.795a5.952 5.952 0 0 1 0-3.828V6.391H1.203a9.943 9.943 0 0 0 0 8.98l3.344-2.576Z"
                  ></path>
                  <path
                    fill="#EA4335"
                    d="M10.2 4.84a5.487 5.487 0 0 1 3.862 1.5l2.874-2.855A9.712 9.712 0 0 0 10.2.881c-1.867 0-3.696.516-5.285 1.488a10.026 10.026 0 0 0-3.712 4.022l3.344 2.576c.797-2.37 3.026-4.128 5.653-4.128Z"
                  ></path>
                </svg>
              </div>
              Or sign in with Google
            </a>
            <div>
              <span>
                Already have an account?{" "}
                <a href="/sign-in" className="text-link1 hover:text-link1Hover">
                  Sign in
                </a>
              </span>
            </div>
          </div>
        </fieldset>
      </Form>
    </div>
  );
}
