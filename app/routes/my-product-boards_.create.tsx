import { Form, useNavigate, useNavigation } from "@remix-run/react";
import AddIcon from "~/svg/AddIcon";
import React from "react";

export default function CreateProductBoard() {
  const navigate = useNavigate();
  return (
    <section className="flex h-full w-full items-center justify-center rounded-sm">
      <div className="bg-white p-4 shadow-sm min-w-[327px] rounded-md">
        <Form className="relative">
          <fieldset>
            <div className="absolute -top-9">
              <AddIcon />
            </div>
            <h1 className="text-headingText1 text-heading3 font-bold mt-4 mb-6">
              Create New Product Board
            </h1>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-headingText1 text-body3 font-bold after:content-['*'] after:ml-1">
                      Board Title
                    </span>
                    <span className="text-text1 text-body3">
                      Add a short, descriptive board title
                    </span>
                  </div>
                  <input
                    onFocus={() => {}}
                    name="title"
                    className="bg-background py-3 text-text1 w-full pl-2 rounded-md"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-headingText1 text-body3 font-bold">
                      Board Description
                    </span>
                    <span className="text-text1 text-body3">
                      Add a description of your product
                    </span>
                  </div>
                  <textarea
                    onFocus={() => {}}
                    name="title"
                    rows={4}
                    className="bg-background p-4 text-text1 w-full pl-2 rounded-md resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end mt-4">
              <div className="w-full md:w-fit flex flex-col md:flex-row gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/my-product-boards");
                  }}
                  className="w-full md:w-fit bg-cancelAction hover:bg-cancelActionHover text-heading4 font-bold p-2 px-4 text-white rounded-md"
                >
                  Cancel
                </button>
                <button className="w-full md:w-fit order-first md:order-last bg-mainAction hover:bg-mainActionHover text-heading4 font-bold p-2 px-4 text-white rounded-md">
                  Create Board
                </button>
              </div>
            </div>
          </fieldset>
        </Form>
      </div>
    </section>
  );
}
