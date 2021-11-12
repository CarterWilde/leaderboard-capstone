import { ChatOutlined } from "@material-ui/icons";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { API_ENDPOINT, WEBSOCKET_ENDPOINT } from "../../../EnviormentVariables";
import { Server, Message as MessageModel, Chat } from "../../../Models";
import IDBTranslator from "../../../Utlities/IDBTranslators";
import { Page, Message, Button } from "../../UI";
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
	
	sendMessage(message: string) {
		this.socket?.send(JSON.stringify({content: message, action: "sendMessage"}));
		this.setState({content: ""});
	}
	
	receivedMessage(message: MessageEvent) {
		let messages: MessageModel[] = [...this.state.messages];
		messages.push(JSON.parse(message.data));
		this.setState({messages: messages});
	}

	async componentDidMount() { 
		this.setState({chat: await IDBTranslator<Chat>(this.props.chatId, `${API_ENDPOINT}/servers/${this.props.server.serverID}/chats/@:`)});
		this.socket = new WebSocket(`${WEBSOCKET_ENDPOINT}/servers/${this.props.server.serverID}/chats/${this.props.chatId}/join`);
		this.socket.addEventListener("message", this.receivedMessage);
		this.socket.addEventListener("open", () => {
			this?.socket?.send(JSON.stringify({
				"action": "getMessages"
			}))
		})
	}

	componentWillUnmount() {
		this.socket?.close();
	}

	render() {
		return (
			<Page className="chat" title={(this.state.chat?.name ? this.state.chat?.name : "Loading")} icon={<ChatOutlined />}>
				<section className="messages">
					{
						this.state.messages
						.map(message => {
							message.publishDate = new Date(message.publishDate);
							return message;
						})
						.sort((a, b) => {
							let aTime = a.publishDate.getTime();
							let bTime = b.publishDate.getTime();
							if(aTime > bTime) {
								return 1;
							}
							else if (bTime > aTime) {
								return -1;
							} else {
								return 0;
							}
						})
						.map(message => {
							return(
								<Message key={message.poster.id + this.props.chatId + message.publishDate} {...message}/>
							);
						})
					}
					{this.state.messages.length === 0 ? "No Messages" : null}
				</section>
				<hr/>
				<footer>
					<input className="messageInput" type="text" defaultValue={this.state.content} placeholder="Message" onChange={(e) => {
						this.setState({content: e.currentTarget.value})
					}}/>
					<Button variant="outline" className="sendMessage" onClick={() => {
						this.sendMessage(this.state.content);
					}}>Send</Button>
				</footer>
			</Page>
		);
	}
}