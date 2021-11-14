import axios from "axios";
import { Component } from "react";
import { connect } from "react-redux";
import { PropsFromRedux } from "../../../App";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Game, Runner, Server } from "../../../Models";
import { RootState } from "../../../store";
import { PopUp } from "../../UI";
import { UserList } from "../../UI/UserList/UserList";

export interface AddModeratorProps extends PropsFromRedux {
	open: boolean;
	onClosed: () => void;
	server: Server;
	game: Game['gameID'];
};

export type AddModeratorState = {
	user?: Runner;
};

class AddModerator extends Component<AddModeratorProps, AddModeratorState> {
	 constructor(props: AddModeratorProps) {
		 super(props);

		 this.onProgress = this.onProgress.bind(this);
	 }

	async onProgress() {
		if(this.state.user) {
			axios.put(`${API_ENDPOINT}/servers/${this.props.server.serverID}/games/${this.props.game}/mods/add/${this.state.user.id}`);
			window.history.go(-1);
		} else {
			throw new Error("No User selected!");
		}
	};

	render() {
		return (
			<PopUp
				title="Add Moderator"
				progressText="Add Moderator"
				width="35%"
				onProgress={this.onProgress}
				{...this.props}
			>
				<UserList users={this.props.server.members.filter(member => !this.props.server.moderators.find(mod => mod.runnerID === member.runnerID))} onSelection={(runner) => {
					this.setState({user: runner})
				}}/>
			</PopUp>
		);
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export default connector(AddModerator);