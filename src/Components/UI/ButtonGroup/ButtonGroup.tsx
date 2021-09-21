import React, { CSSProperties, ReactNode } from "react";

import "./ButtonGroup.css";

type ButtonGroupProps  = {
    children?: ReactNode
    style?: CSSProperties
};

const ButtonGroup = (props: ButtonGroupProps) => {
    React.Children.forEach(props.children, (child) => {
        if(child == null
        || child === undefined
        || typeof(child) == "string"
        || typeof(child) == "boolean"
        || typeof(child) == "number") throw new Error("Invalid Child Element expected 'Button'");
    });
    return(
        <div className="btn-group" style={props.style}>
            {props.children}
        </div>
    );
}

export default ButtonGroup;