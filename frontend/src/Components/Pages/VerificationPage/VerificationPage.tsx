import { Check, Close, VerifiedUserOutlined, Videocam } from "@material-ui/icons";
import axios, { AxiosResponse } from "axios";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Duration, Game, Ruleset, Run, Runner, Server } from "../../../Models";
import IDBTranslator from "../../../Utlities/IDBTranslators";
import { Page } from "../../UI";
import "./VerificationPage.css"

export interface VerificationPageProps extends RouteComponentProps {
	server: Server;
}

interface RealizedRun extends Run {
	duration: Duration;
	runner: Runner;
	game: Game;
	ruleset: Ruleset;
}

export type VerificationPageState = {
	runs: RealizedRun[];
}

export default class VerificationPage extends Component<VerificationPageProps, VerificationPageState> {
	constructor(props: VerificationPageProps) {
		super(props);

		this.state = {
			runs: []
		}

		this.verifyRun = this.verifyRun.bind(this);
	}

	async componentDidMount() {
		let runs = await (await axios.get<never, AxiosResponse<Run[]>>(`${API_ENDPOINT}/servers/${this.props.server.serverID}/runs/verification`)).data;
		let realizedRuns: RealizedRun[] = await Promise.all(runs.map(async run => {
			let ruleset: Ruleset = await IDBTranslator<Ruleset>(run.rulesetID, `${API_ENDPOINT}/rulesets/@:`);
			let game: Game = await IDBTranslator<Game>(ruleset.gameID, `${API_ENDPOINT}/games/@:`);
			return { ...run, duration: new Duration(run.runTime), runner: await IDBTranslator<Runner>(run.runnerID, `${API_ENDPOINT}/runners/@:`), ruleset: ruleset, game: game};
		}));
		this.setState({ runs: realizedRuns })
	}

	async verifyRun(run: RealizedRun, isAccepted: boolean) {		
		await axios.put(`${API_ENDPOINT}/verify-run/${run.runID}`, { isAccepted: isAccepted });
		this.setState({runs: this.state.runs.filter(r => r.runID !== run.runID)})
	}

	render() {
		return (
			<Page className="verification" title="Run Verification" icon={<VerifiedUserOutlined />}>
				{this.state.runs
					.map(run => {
						return (
							<section key={run.runID} className="run-verification-item">
								<a href={`/${this.props.server.serverID}/${run.game.gameID}/${run.ruleset.rulesetID}`}>{run.game.title} - {run.ruleset.title}</a>
								<p>{run.runner.username}#{run.runner.discriminator}</p>
								<p>{run.duration.toDurationString()}</p>
								<a href={run.videoURL} style={{ color: "white" }} target="_blank" rel="noreferrer"><Videocam /></a>
								<div className="options">
									<Check className="check" onClick={() => {
										this.verifyRun(run, true);
									}}/>
									<Close className="reject" onClick={() => {
										this.verifyRun(run, false);
									}}/>
								</div>
							</section>
						);
					})}
					{this.state.runs.length === 0 ? "No pending verifications." : null}
			</Page>
		);
	}
}