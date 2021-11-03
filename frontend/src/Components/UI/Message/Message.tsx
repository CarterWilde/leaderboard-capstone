import { Message as MessageModel } from "../../../Models";

import "./Message.css"

const Message = (props: MessageModel) => {
	return (
		<div className="message">
			<div className="header">{props.poster.username}#{props.poster.discriminator}</div>
			<div className="content">{props.content}</div>
		</div>
	);
}

export default Message;