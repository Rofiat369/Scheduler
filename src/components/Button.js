import React, { Fragment } from "react";
import classNames from "classnames";
import "components/Button.scss";

export default function Button(props) {
  const buttonClass = classNames("button", {
    "button--confirm": props.confirm,
    "button--danger": props.danger
  });

  return (
    <Fragment>
      <button
        className={buttonClass}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    </Fragment>
  );
}
