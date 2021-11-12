import { CSSProperties, HTMLAttributes} from "react";
import "./Card.css";

type CardProps = {
    className?: HTMLAttributes<HTMLDivElement>['className'],
    children?: React.ReactNode,
    onClick?: HTMLAttributes<HTMLDivElement>['onClick'],
    style?: CSSProperties,
		title?: HTMLAttributes<HTMLDivElement>['title']
};

const Card = (props : CardProps) => {
    return(
        <div title={props.title} className={`card` + (props.className ? ' ' + props.className : '' )} onClick={props.onClick} style={props.style}>
            {props.children}
        </div>
    );
}

export default Card;