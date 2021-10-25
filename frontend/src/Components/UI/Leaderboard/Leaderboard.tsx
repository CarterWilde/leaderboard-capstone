import { Component } from "react";
import { Ruleset, Column, Duration, Run, VOD, Runner } from "../../../Models";
import data from "../../../dummy-data.json";
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
	columns: Column[]
	runs: RealizedRun[];
}

export default class Leaderboard extends Component<LeaderboardProps, LeaderboardState> {
	constructor(props: LeaderboardProps) {
		super(props);
		this.state = { columns: ([] as Column[]).filter(column => column.category === this.props.ruleset.rulesetID || column.category === null), runs: [] };
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
						{this.state.columns.map(column => (
							<th key={column.id}>{column.name}</th>
						))}
					</tr>
				</thead>
				<tbody>
				{/* .filter(run => run.rulesetID === this.props.ruleset.rulesetID)
						.sort(this.props.sorter ? this.props.sorter : (run1, run2) => {
							const a = run1.values.find(value => ColumnConverter.Resolve(this.state.columns, value) instanceof Duration)?.value;
							const b = run2.values.find(value => ColumnConverter.Resolve(this.state.columns, value) instanceof Duration)?.value;
							if (a > b) return 1;
							else if (a === b) return 0;
							else if (a < b) return -1;
							else throw new Error("Unable to compare values!");
						}) */}
					{this.state.runs
						.map((run, postion) => (
							<tr key={run.runID}>
								<td>
									{postion + 1}
								</td>
								<td>
									{run.runner.username + '#' + run.runner.discriminator}
								</td>
								{/* {
									run.values.map(valueColumn => {
										return { key: valueColumn.id, value: ColumnConverter.Resolve(this.state.columns, valueColumn) }
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
											<td key={converted.key}>{display}</td>
										);
									})
								} */}
							</tr>
						))}
				</tbody>
			</table>
		);
	}
}