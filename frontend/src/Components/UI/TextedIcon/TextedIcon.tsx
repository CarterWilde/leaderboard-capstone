import { SvgIconProps } from "@material-ui/core";
import { SvgIconComponent } from "@material-ui/icons";
import { CSSProperties, ReactElement } from "react";

import "./TextedIcon.css";

export type TextedIconProps = {
    className?: string;
    icon: ReactElement<SvgIconProps, SvgIconComponent>;
    children: string;
    style?: CSSProperties;
    size?: string;
		onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const TextedIcon = (props: TextedIconProps) => {
    return(
        <div className={"texted-icon" + (props.className ? ` ${props.className}` : '')} style={{height: `calc(${props.size} + .5em)`, fontSize: props.size, ...props.style}} onClick={props.onClick}>
            {props.icon}
            <p>{props.children}</p>
        </div>
    );
}

export default TextedIcon