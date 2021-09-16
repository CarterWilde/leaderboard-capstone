import React, { ReactNode } from "react";

import "./ButtonGroup.css";

type ButtonGroupProps  = {
    children?: ReactNode
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
        <div className="btn-group">
            {props.children}
        </div>
    );
}

export default ButtonGroup;