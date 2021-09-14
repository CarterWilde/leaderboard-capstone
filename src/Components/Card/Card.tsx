import { HTMLAttributes} from "react";
import "./Card.css";

type CardProps = {
    className?: HTMLAttributes<HTMLDivElement>['className'],
    children?: React.ReactNode,
    onClick?: HTMLAttributes<HTMLDivElement>['onClick']
};

const Card = (props : CardProps) => {
    return(
        <div className={`card` + (props.className ? ' ' + props.className : '' )} onClick={props.onClick} >
            {props.children}
        </div>
    );
}

export default Card;