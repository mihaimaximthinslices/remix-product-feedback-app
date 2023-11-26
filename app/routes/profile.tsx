import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { getSession } from "~/sessions.server";
import { userRepository } from "~/infrastructure/prisma/userRepository";
import { useLoaderData } from "react-router";
import React, { ChangeEvent } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import * as Toast from "@radix-ui/react-toast";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { validateBase64Image } from "~/utils.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("email") || !session.get("email")) {
    return redirect("/");
  }

  const email = session.get("email")!;

  const user = await userRepository.getByEmail(email);

  if (!user) {
    return redirect("/");
  }

  return json({
    user: {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

const formSchema = z.object({
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
  base64Image: z
    .string()
    .optional()
    .nullable()
    .refine(
      async (value) => {
        return value
          ? await validateBase64Image(value.split("base64,")[1])
          : true;
      },
      { message: "Invalid base64 image format or dimensions" }
    ),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const validator = withZod(formSchema);

  const session = await getSession(request.headers.get("Cookie"));

  const sessionEmail = session.get("email");

  const { error, data } = await validator.validate(await request.formData());

  if (error) {
    return json({ errors: error.fieldErrors }, { status: 400 });
  }

  const { username, base64Image: avatar } = data;

  const user = await userRepository.getByEmail(sessionEmail!);

  if (!user) {
    return redirect("/");
  }

  const alreadyExistingUsername = await userRepository.getByUsername(username);

  if (alreadyExistingUsername && alreadyExistingUsername.id !== user.id) {
    return json(
      {
        errors: {
          username: "Username already exists",
        },
      },
      { status: 400 }
    );
  }

  await userRepository.save({
    ...user,
    username,
    avatar: avatar ? avatar : user.avatar,
  });

  return null;
};
export default function Profile() {
  const handleSelectProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const file = event.target.files[0];

    if (!(file.type === "image/jpeg" || file.type === "image/png")) {
      return;
    }
    const reader = new FileReader();

    reader.onload = function (e) {
      const base64Image = e.target!.result as string;
      const img = new Image();
      img.onload = function () {
        if (img.width <= 1024 && img.height <= 1024) {
          setProfileImage(base64Image);
        } else {
          uploadImageInputRef?.current &&
            (uploadImageInputRef.current.value = "");

          setOpen(true);
        }
      };

      img.src = base64Image;
    };

    reader.readAsDataURL(file);
  };

  const {
    user: { username, email, avatar },
  } = useLoaderData() as {
    user: {
      username: string;
      email: string;
      avatar: string | undefined;
    };
  };

  const [open, setOpen] = React.useState(false);

  const [profileImage, setProfileImage] = React.useState<string | undefined>(
    avatar
  );

  const actionData = useActionData<typeof action>();

  const usernameError = actionData?.errors?.username;

  const navigation = useNavigation();

  const state = navigation.state;

  const isSubmitting = state === "submitting";

  const uploadImageInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="h-full w-full flex items-center justify-center">
      <InvalidFileTypeToast open={open} setOpen={setOpen} />

      <div className="rounded-md shadow-sm p-4 bg-navbar1 flex flex-col">
        <Form method="POST">
          <fieldset disabled={isSubmitting}>
            <div className="flex flex-col gap-2">
              <h1 className="text-headingText1 text-heading3 font-bold">
                Profile
              </h1>
              <span className="text-heading3 text-text1">
                This is how others will see you on the site
              </span>
            </div>
            <hr className="border-gray2 mb-2 w-full mt-2" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 items-start">
                  <label className="text-headingText1 font-bold text-heading4">
                    Profile picture
                  </label>
                  <input
                    onChange={handleSelectProfileImage}
                    ref={uploadImageInputRef}
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    className="text-sm text-stone-500
                 w-[95px] overflow-hidden
                 file:mr-5 file:py-1 file:px-3 file:rounded-md file:border-0
                 file:text-text1
                 file:bg-background
                 hover:file:cursor-pointer"
                  />
                  <input
                    hidden={true}
                    name="base64Image"
                    defaultValue={profileImage ?? ""}
                  />
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <ProfileAvatar src={profileImage} />
                  <span className="text-body3 text-text1">
                    Max 1024x1024px, PNG or JPG.
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 items-start">
                  <label
                    className="text-headingText1 font-bold text-heading4"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    onFocus={() => {}}
                    defaultValue={username}
                    name="username"
                    className="bg-background rounded-sm p-1 text-text1 min-w-[200px] pl-2"
                    type="text"
                  />
                </div>
                {usernameError && (
                  <span className="-mt-2 text-sm text-error1">
                    {usernameError}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-mainAction hover:bg-mainActionHover text-white p-2 rounded-md mt-4 text-heading4 font-bold"
            >
              {isSubmitting ? "Updating profile..." : "Update profile"}
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}

const ProfileAvatar = ({ src }: { src?: string }) => (
  <div className="flex gap-5">
    <Avatar.Root className="bg-blackA1 inline-flex h-[60px] w-[60px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
      <Avatar.Image
        className="h-full w-full rounded-[inherit] object-cover"
        src={src}
        alt="Colm Tuite"
      />
      <Avatar.Fallback
        style={{ backgroundColor: "#F3F4F6" }}
        className="text-violet11 leading-1 flex h-full w-full items-center justify-center text-[15px] font-medium"
        delayMs={600}
      ></Avatar.Fallback>
    </Avatar.Root>
  </div>
);

const InvalidFileTypeToast = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="bg-white rounded-md shadom-sm p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="[grid-area:_title] mb-[5px] text-headingText1 text-heading3">
          Image too large
        </Toast.Title>
        <Toast.Description asChild>
          <span className="text-text1 text-body3">
            Image must be below 1024x1024px
          </span>
        </Toast.Description>
        <Toast.Action
          className="[grid-area:_action]"
          asChild
          altText="Goto schedule to undo"
        >
          <button className="text-headingText1 text-heading4">Close</button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
};
