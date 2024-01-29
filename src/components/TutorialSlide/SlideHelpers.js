import React from "react";

export function TextByImage(props) {
  return (
      <div className={"tbi" + (props.center ? " center" : "")}>
          <img src={props.img} />
          <div className="tbi-text">{props.children}</div>
      </div>
  );
}