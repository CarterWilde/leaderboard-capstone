import { SvgIconProps } from "@material-ui/core";
import { SvgIconComponent } from "@material-ui/icons";
import { CSSProperties, ReactElement } from "react";

import "./ServerIcon.css";

export type ServerIconProps = {
    className?: string;
    icon: string | ReactElement<SvgIconProps, SvgIconComponent>;
    style?: CSSProperties;
    size?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    active?: boolean;
}

const ServerIcon = (props: ServerIconProps) => {
    let backgroundStyles:CSSProperties = typeof(props.icon) === "string" ? {backgroundImage: `url(${props.icon})`} : {};
    return(
        <div className={"server-icon" + ((props.active) ? " active" : "") + (props.className ? ` ${props.className}` : '')}
             style={typeof(props.icon) === "string" ? {...props.style, margin: "0px", padding: "5px", backgroundColor: "none"} : props.style}
             onClick={props.onClick}>
            <div className="child" style={backgroundStyles}>
                {typeof(props.icon) !== "string" ? props.icon : null}
            </div>
        </div>
    );
}

export default ServerIcon;