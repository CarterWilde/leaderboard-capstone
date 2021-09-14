import React, { CSSProperties, ReactNode } from "react";

type ButtonProps  = {
    children?: ReactNode,
    variant?: "text" | "outline" | "primary" | "contained",
    onClick?: React.MouseEventHandler<HTMLDivElement>,
    color?: string
};

export class InvalidVariantError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "InvalidVariantError";
    }
}

const primaryStyles: CSSProperties = {
    color: "white",
    backgroundColor: "#5cfcac",
    borderRadius: "3px",
    padding: "4px 10px",
    lineHeight: "0.8em",
    boxShadow: "3px 2px 8px 4px rgba(0,0,0,0.49);"
};

const outlineStyles: CSSProperties = {
    color: "#5cfcac",
    border: "2px solid #25282e",
    borderRadius: "3px",
    padding: "4px 10px",
    lineHeight: "0.8em"
};

const textStyles: CSSProperties = {
    color: "#828387",
    fontWeight: "lighter"
};

const Button = (props: ButtonProps) => {
    let pickedStyle: CSSProperties;
    if(props.variant) {
        switch (props.variant) {
            case "primary":
                pickedStyle = primaryStyles;
                break;
            case "outline":
                pickedStyle = outlineStyles;
                break;
            case "text":
                pickedStyle = textStyles;
                break;
            default:
                throw new InvalidVariantError(`No variant of the type ${props.variant}`);
        }
    } else {
        pickedStyle = primaryStyles;
    }
    if(props.color) pickedStyle = {...pickedStyle, color: props.color}
    return(
        <div className="btn" onClick={props.onClick} style={{...pickedStyle, cursor: "pointer", width: "fit-content"}}>
            {props.children}
        </div>
    );
}

export default Button;