import { Add } from "@material-ui/icons";
import { CSSProperties, HTMLAttributes } from "react";
import { Card } from "..";
import "./AddCard.css";

export const AddCard = (props: {className?: string, onClick?: HTMLAttributes<HTMLDivElement>['onClick'], style?: CSSProperties}) => (
	<Card className={"add flair-hover " +  (props.className ? props.className : "")} onClick={props.onClick} style={props.style}>
		<Add />
	</Card>
);

export default AddCard;