import axios from "axios";
import { Component } from "react";
import { connect } from "react-redux";
import { PropsFromRedux } from "../../../App";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Game, Ruleset, Server } from "../../../Models";
import { RootState } from "../../../store";
import { Feild, PopUp } from "../../UI";

export interface SubmitRunProps extends PropsFromRedux {
	open: boolean;
	onClosed: () => void;
	serverID: Server['serverID'];
	gameID: Game['gameID'];
	rulesetID: Ruleset['rulesetID'];
};

export type SubmitRunState = {
	runTime: number;
	videoUrl: string;
};

class SubmitRun extends Component<SubmitRunProps, SubmitRunState> {
	constructor(props: SubmitRunProps) {
		super(props);
		this.state = {
			runTime: 0,
			videoUrl: ""
		}

		this.onProgress = this.onProgress.bind(this);
	}

	async onProgress() {
		await axios.put(`${API_ENDPOINT}/servers/${this.props.serverID}/${this.props.gameID}/${this.props.rulesetID}/runs/add`, {
			RunTime: this.state.runTime,
			VideoUrl: this.state.videoUrl
		});
		window.location.reload();
	}

	render() {
		return (
			<PopUp
				title="Submit Run"
				progressText="Submit"
				width="24%"
				onProgress={this.onProgress}
				{...this.props}
			>
				<p style={{ padding: "12px 0" }}>Make this server yours!</p>
				<Feild style={{ padding: "12px 0px" }} name="Run Length" type="number" onChange={(e) => { this.setState({ runTime: e.currentTarget.valueAsNumber }) }} />
				<Feild style={{ paddingBottom: "12px" }} name="Video URL" type="url" onChange={(e) => { this.setState({ videoUrl: e.currentTarget.value }) }} />
			</PopUp>
		);
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export default connector(SubmitRun);