import { MessageOutlined as MessageIcon } from "@material-ui/icons";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { WEBSOCKET_ENDPOINT } from "../../../EnviormentVariables";
import { Server, Message as MessageModel, Chat } from "../../../Models";
import { Page, Message } from "../../UI";
import "./ChatPage.css";

export interface MessageDTO {
	content: string;
}

export interface ChatPageProps extends RouteComponentProps {
	server: Server;
	chatId: string;
};
export type ChatPageState = {
	chat?: Chat;
	content: string;
	messages: MessageModel[];
};

export default class ChatPage extends Component<ChatPageProps, ChatPageState> {
	socket?: WebSocket;
	constructor(props: ChatPageProps) {
		super(props);
		this.state = {
			content: "",
			messages: []
		}

		this.sendMessage = this.sendMessage.bind(this);
		this.receivedMessage = this.receivedMessage.bind(this);
	}
	
	sendMessage(message: MessageDTO) {
		this.socket?.send(JSON.stringify(message));
	}
	
	receivedMessage(message: MessageEvent) {
		let messages: MessageModel[] = [...this.state.messages];
		messages.push(JSON.parse(message.data));
		this.setState({messages: messages});
	}

	componentDidMount() {
		this.socket = new WebSocket(`${WEBSOCKET_ENDPOINT}/servers/${this.props.server.serverID}/chats/${this.props.chatId}/join`);
		this.socket.addEventListener("message", this.receivedMessage);
	}

	componentWillUnmount() {
		this.socket?.close();
	}

	render() {
		return (
			<Page className="chat" title={(this.state.chat?.name ? this.state.chat?.name : "Loading")} icon={<MessageIcon />}>
				<section className="messages">
					{
						this.state.messages.map(message => {
							return(
								<Message key={message.poster.id + this.props.chatId + message.publishDate} {...message}/>
							);
						})
					}
					{this.state.messages.length === 0 ? "No Messages" : null}
				</section>
				<div>
					<input type="text" defaultValue={this.state.content} onChange={(e) => {
						this.setState({content: e.currentTarget.value})
					}}/>
					<button onClick={() => {
						this.sendMessage({content: this.state.content})
					}}>Send</button>
				</div>
			</Page>
		);
	}
}