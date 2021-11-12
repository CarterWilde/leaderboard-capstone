import { Add } from "@material-ui/icons";
import { CSSProperties, HTMLAttributes } from "react";
import { Card } from "..";
import "./AddCard.css";

export type AddCardProps = {
	className?: string,
	onClick?: HTMLAttributes<HTMLDivElement>['onClick'],
	style?: CSSProperties,
	variant?: "main" | "outline";
}

export const AddCard = (props: AddCardProps) => {
	let className = "add flair-hover";
	if(props.className) {
		className += " " + props.className;
	}
	switch (props.variant) {
		case "main":
			className += " main";
		break;
		default:
			className += (props.variant ? " " + props.variant : "");
		break;
	}
	return (
		<Card className={className} onClick={props.onClick} style={props.style}>
			<Add />
		</Card>
	);
}

export default AddCard;