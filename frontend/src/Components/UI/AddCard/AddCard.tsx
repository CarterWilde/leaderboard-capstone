import { Add } from "@material-ui/icons";
import { HTMLAttributes } from "react";
import { Card } from "..";
import "./AddCard.css";

export const AddCard = (props: {className?: string, onClick?: HTMLAttributes<HTMLDivElement>['onClick']}) => (
	<Card className={"add flair-hover " +  (props.className ? props.className : "")} onClick={props.onClick}>
		<Add />
	</Card>
);

export default AddCard;