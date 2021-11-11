import { Message as MessageModel } from "../../../Models";

import "./Message.css"

const Message = (props: MessageModel) => {
	return (
		<div className="message">
			<aside>
				<img src={`https://cdn.discordapp.com/avatars/${props.poster.id}/${props.poster.avatar}.png?size=32`} alt=""/>
			</aside>
			<section>
				<div className="header">{props.poster.username}</div>
				<div className="content">{props.content}</div>
			</section>
		</div>
	);
}

export default Message;