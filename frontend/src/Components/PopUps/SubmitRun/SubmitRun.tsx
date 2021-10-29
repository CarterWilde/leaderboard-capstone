import axios from "axios";
import { Component } from "react";
import { connect } from "react-redux";
import { PropsFromRedux } from "../../../App";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { ColumnValue, Game, Ruleset, Server } from "../../../Models";
import { RootState } from "../../../store";
import ColumnConverter from "../../../Utlities/ColumnConverter";
import { Feild, PopUp } from "../../UI";

export interface SubmitRunProps extends PropsFromRedux {
	open: boolean;
	onClosed: () => void;
	serverID: Server['serverID'];
	game: Game;
	ruleset: Ruleset;
};

export type SubmitRunState = {
	runTime: number;
	videoUrl: string;
	values: ColumnValue[];
};

class SubmitRun extends Component<SubmitRunProps, SubmitRunState> {
	constructor(props: SubmitRunProps) {
		super(props);
		this.state = {
			runTime: 0,
			videoUrl: "",
			values: this.props.ruleset.columns.map(c => {
				return {id: "", columnId: c.id, value: ""}
			})
		}

		this.onProgress = this.onProgress.bind(this);
	}

	async componentDidMount() {

	}

	async onProgress() {
		await axios.put(`${API_ENDPOINT}/servers/${this.props.serverID}/${this.props.game.gameID}/${this.props.ruleset.rulesetID}/runs/add`, {
			RunTime: this.state.runTime,
			VideoUrl: this.state.videoUrl,
			Values: this.state.values
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
				{
					this.props.ruleset.columns.map(column => {
						return (
							<Feild key={column.id + this.props.ruleset.rulesetID} style={{padding: "12px 0px"}} name={column.name} type={ColumnConverter.ToHTMLInputType(column)} defaultValue={this.state.values.find(s => s.columnId === column.id)?.value} onChange={(e) => {
								this.setState(prevState => {
									let values = Object.assign([], prevState.values) as ColumnValue[];
									let val = values.find(val => val.columnId === column.id);
									if(val) {
										val.value = e.target.value;
									}
									return { values: values }
								});
							}}/>
							);
						})
					}
					<Feild style={{ paddingBottom: "12px" }} name="Video URL" type="url" onChange={(e) => { this.setState({ videoUrl: e.currentTarget.value }) }} />
			</PopUp>
		);
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export default connector(SubmitRun);