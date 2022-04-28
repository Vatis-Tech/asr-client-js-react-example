import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
// components

const wrapperColors = {
  success: "bg-lime-50",
  warning: "bg-orange-50",
  error: "bg-red-50",
  info: "bg-cyan-50",
};

const svgColors = {
  success: "text-lime-400",
  warning: "text-orange-400",
  error: "text-red-400",
  info: "text-cyan-400",
};

const descriptionColors = {
  success: "text-lime-800",
  warning: "text-orange-800",
  error: "text-red-800",
  info: "text-cyan-800",
};

const closeColors = {
  success:
    "bg-lime-50 text-lime-500 hover:bg-lime-100 focus:ring-offset-lime-50 focus:ring-lime-600",
  warning:
    "bg-orange-50 text-orange-500 hover:bg-orange-100 focus:ring-offset-orange-50 focus:ring-orange-600",
  error:
    "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600",
  info: "bg-info-50 text-info-500 hover:bg-info-100 focus:ring-offset-info-50 focus:ring-info-600",
};

function WithDismissButton({ type, description }) {
  const [show, setShow] = React.useState(true);
  if (!show) {
    return null;
  }
  return (
    <>
      {/* This example requires Tailwind CSS v2.0+ */}
      <div className={clsx("rounded-md p-4", wrapperColors[type])}>
        <div className="flex">
          <div className="flex-shrink-0">
            {/* Heroicon name: solid/check-circle */}
            <svg
              className={clsx("h-5 w-5", svgColors[type])}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className={clsx("text-sm font-medium", descriptionColors[type])}>
              {description}
            </p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={() => {
                  setShow(false);
                }}
                className={clsx(
                  "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ease-linear transition-all duration-150",
                  closeColors[type]
                )}
              >
                <span className="sr-only">Dismiss</span>
                {/* Heroicon name: solid/x */}
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

WithDismissButton.defaultProps = {
  type: "info",
};

WithDismissButton.propTypes = {
  type: PropTypes.oneOf(["info", "success", "warning", "error"]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default WithDismissButton;
