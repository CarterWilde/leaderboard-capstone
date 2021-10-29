import { Component } from "react";
import { Ruleset, Duration, Run, VOD, Runner } from "../../../Models";
import ColumnConverter from "../../../Utlities/ColumnConverter";
import Translator from "../../../Utlities/IDTranslators";
import { Videocam } from "@material-ui/icons";

import "./Leaderboard.css"
import { API_ENDPOINT } from "../../../EnviormentVariables";

export type LeaderboardProps = {
	ruleset: Ruleset;
	runs: Run[];
	sorter?: (a: Run, b: Run) => number;
}

interface RealizedRun extends Run {
	runner: Runner;
};

type LeaderboardState = {
	runs: RealizedRun[];
}

export default class Leaderboard extends Component<LeaderboardProps, LeaderboardState> {
	constructor(props: LeaderboardProps) {
		super(props);
		this.state = { runs: [] };
	}

	async componentDidMount() {
		this.setState({
			runs: await Promise.all(this.props.runs.map(async run => {
				let realizedRun: RealizedRun = {
					...run,
					runner: await Translator<Runner>(run.runnerID, `${API_ENDPOINT}/runners/@:`)
				};
				return realizedRun;
			}))
		})
	}

	render() {
		return (
			<table className="leaderboard">
				<thead>
					<tr style={{ textTransform: "capitalize" }}>
						<th>Rank</th>
						<th>Runner</th>
						<th>Run Time</th>
						<th>Publish Date</th>
						{this.props.ruleset.columns.map(column => (
							<th key={column.id + this.props.ruleset.rulesetID}>{column.name}</th>
						))}
						<th>VOD</th>
					</tr>
				</thead>
				<tbody>
					{this.state.runs.filter(run => run.rulesetID === this.props.ruleset.rulesetID)
						.sort(this.props.sorter ? this.props.sorter : (run1, run2) => {
							const a = run1.runTime;
							const b = run2.runTime;
							if (a > b) return 1;
							else if (a === b) return 0;
							else if (a < b) return -1;
							else throw new Error("Unable to compare values!");
						})
						.map(run => ({...run, publishDate: new Date(run.publishDate), runTime: new Duration(run.runTime)}))
						.map((run, postion) => (
							<tr key={run.runID}>
								<td>
									{postion + 1}
								</td>
								<td>
									{run.runner.username + '#' + run.runner.discriminator}
								</td>
								<td>{run.runTime.toDurationString()}</td>
								<td>{`${run.publishDate.getMonth() + 1}/${run.publishDate.getDate()}/${run.publishDate.getFullYear()}`}</td>
								{
									run.values.map(valueColumn => {
										return { key: valueColumn.id, value: ColumnConverter.Resolve(this.props.ruleset.columns, valueColumn) }
									}).map(converted => {
										let display;
										if (converted.value instanceof Date) {
											const d = converted.value;
											display = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
										}
										else if (converted.value instanceof VOD) {
											display = <a href={converted.value.url} style={{ color: "white" }} target="_blank" rel="noreferrer"><Videocam /></a>;
										} else {
											display = converted.value.toString();
										}
										return (
											<td key={converted.key + this.props.ruleset.rulesetID}>{display}</td>
											);
										})
									}
									<td><a href={run.videoURL} style={{ color: "white" }} target="_blank" rel="noreferrer"><Videocam /></a></td>
							</tr>
						))}
				</tbody>
			</table>
		);
	}
}