import React, { CSSProperties, ReactNode } from "react";

import "./Button.css";

type ButtonProps  = {
		style?: CSSProperties,
		className?: string,
    children?: ReactNode,
    variant?: "text" | "outline" | "primary" | "contained" | "filled" | "inline",
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
        <div className={"btn" + (props.variant ? ` ${props.variant}` : ' primary') + (props.className ? ` ${props.className}` : "")} onClick={props.onClick} style={{cursor: props.onClick ? "pointer": undefined, width: "fit-content", color: props.color, ...props.style}}>
            {props.children}
        </div>
    );
}

export default Button;