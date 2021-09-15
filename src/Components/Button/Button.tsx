import React, { ReactNode } from "react";

import "./Button.css";

type ButtonProps  = {
    children?: ReactNode,
    variant?: "text" | "outline" | "primary" | "contained" | "filled",
    onClick?: React.MouseEventHandler<HTMLDivElement>,
    color?: string
};

export class InvalidVariantError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "InvalidVariantError";
    }
}

const Button = (props: ButtonProps) => {
    return(
        <div className={"btn" + (props.variant ? ` ${props.variant}` : ' primary')} onClick={props.onClick} style={{cursor: "pointer", width: "fit-content", color: props.color}}>
            {props.children}
        </div>
    );
}

export default Button;