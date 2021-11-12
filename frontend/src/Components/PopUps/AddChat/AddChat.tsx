import axios, { AxiosResponse } from "axios";
import { Component } from "react";
import { connect } from "react-redux";
import { PropsFromRedux } from "../../../App";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Chat, Server } from "../../../Models";
import { addChat } from "../../../reducers";
import { RootState } from "../../../store";
import { Feild, PopUp } from "../../UI";

export interface AddChatProps extends PropsFromRedux {
	open: boolean;
	onClosed: () => void;
	serverID: Server['serverID'];
};

export type AddChatState = {
	name: string;
	icon: string;
};

class AddChat extends Component<AddChatProps, AddChatState> {
	 constructor(props: AddChatProps) {
		 super(props);
		 this.state = {
			 name: "",
			 icon: ""
		 }

		 this.onProgress = this.onProgress.bind(this);
	 }

	async onProgress() {
		var chatRes = await axios.post<{Name: string}, AxiosResponse<Chat>>(`${API_ENDPOINT}/servers/${this.props.serverID}/chats`, {
			Name: this.state.name
		});
		this.props.dispatch(addChat(chatRes.data));
	};

	render() {
		return (
			<PopUp
				title="Add Chat"
				progressText="Add Chat"
				width="24%"
				onProgress={this.onProgress}
				{...this.props}
			>
				<Feild style={{ padding: "12px 0px" }} name="Name" type="text" onChange={(e) => { this.setState({name: e.currentTarget.value}) }} />
			</PopUp>
		);
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export default connector(AddChat);