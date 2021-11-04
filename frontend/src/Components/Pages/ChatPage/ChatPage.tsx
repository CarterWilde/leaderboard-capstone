import { MessageOutlined as MessageIcon } from "@material-ui/icons";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Server, Message as MessageModel, Chat } from "../../../Models";
import { Page, Message } from "../../UI";
import "./ChatPage.css";

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
	constructor(props: ChatPageProps) {
		super(props);
		this.state = {
			content: "",
			messages: []
		}

		this.sendMessage = this.sendMessage.bind(this);
	}

	async sendMessage() {
	}

	async componentDidMount() {
		
	}

	render() {
		return (
			<Page className="chat" title={(this.state.chat?.name ? this.state.chat?.name : "Loading")} icon={<MessageIcon />}>
				<section className="messages">
					{
						this.state.messages.map(message => {
							return(
								<Message {...message}/>
							);
						})
					}
					{this.state.messages.length === 0 ? "No Messages" : null}
				</section>
				<div>
					<input type="text" defaultValue={this.state.content} onChange={(e) => {
						this.setState({content: e.currentTarget.value})
					}}/>
					<button onClick={this.sendMessage}>Send</button>
				</div>
			</Page>
		);
	}
}