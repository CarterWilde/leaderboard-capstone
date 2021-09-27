import Card from "../Card/Card";
import { CSSProperties, HTMLAttributes } from "react";
import { ReactFitty } from "react-fitty";

import "./GameCard.css";

type GameCardProps = {
    className?: HTMLAttributes<HTMLDivElement>['className'],
    onClick?: HTMLAttributes<HTMLDivElement>['onClick'],
    style?: CSSProperties,
    image: string,
    title: string
};

const GameCard = (props : GameCardProps) => {
    const styles: CSSProperties | undefined = props.onClick ? { cursor: "pointer", ...props.style } : props.style
    return(
        <Card className={`game` + (props.className ? ' ' + props.className : '' )} onClick={props.onClick} style={styles}>
            <div className="image" style={{backgroundImage: `url(${props.image})`}}/>
            <ReactFitty className="title" wrapText={true} minSize={18}>{props.title}</ReactFitty>
        </Card>
    );
}

export default GameCard;