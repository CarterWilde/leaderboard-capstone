import { Add } from "@material-ui/icons";
import { Card } from "..";
import "./AddCard.css";

export const AddCard = (props: {className?: string}) => (
	<Card className={"add flair-hover " +  (props.className ? props.className : "")}>
		<Add />
	</Card>
);

export default AddCard;