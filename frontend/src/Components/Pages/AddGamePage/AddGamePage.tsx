import { Settings } from "@material-ui/icons";
import axios, { AxiosResponse } from "axios";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Column, Game, Server } from "../../../Models";
import { Button, Feild, Page, ButtonGroup, GameCard } from "../../UI";
import "./AddGamePage.css";

export interface AddGamePageProps extends RouteComponentProps {
	server: Server;
};

type GameDTO = {
	title: string;
	rules: string;
	image: string;
};

type RulesetDTO = {
	key: string;
	title: string;
	rules: string;
	columns: Column[];
};

interface GameRequestDTO extends GameDTO {
	rulesets: RulesetDTO[];
}

export type AddGamePageState = {
	games: Game[];
	game: GameDTO;
	rulesets: RulesetDTO[];
};

export default class AddGamePage extends Component<AddGamePageProps, AddGamePageState> {
	constructor(props: AddGamePageProps) {
		super(props);

		this.state = {
			games: [],
			game: {
				image: "",
				title: "",
				rules: "",
			},
			rulesets: []
		};
	}

	async componentDidMount() {
		this.setState({
			games: await (await axios.get<Game[]>(`${API_ENDPOINT}/games`)).data
		});
	}

	async addGame(game: Game) {
		await axios.put(`${API_ENDPOINT}/servers/${this.props.server.serverID}/games/add/${game.gameID}`);
		this.props.history.goBack();
	}

	render() {
		return (
			<Page className="add-game" title="Add a Game" icon={<Settings />}>
				<section className="search">
					<header>
						<h2>Add a Game</h2>
					</header>
					<footer>
						{this.state.games
								.filter(game => {
									return !this.props.server.games.map(game => game.gameID)
										.includes(game.gameID);
								})
								.map((game: Game) => {
							return(
								<GameCard {...game} key={game.gameID} style={{width: "200px"}} onClick={() => {
									this.addGame(game);
								}}/>
							);
						})}
					</footer>
				</section>
				<section className="admin">
					<header>
						<h2>Create a Game</h2>
						<div className="split">
							<Feild name="Name" type="text" defaultValue={this.state.game.title} onChange={(e) => {
							this.setState({game: {...this.state.game, title: e.currentTarget.value}});
						}}/>
							<Feild name="Image" type="url" defaultValue={this.state.game.image} onChange={(e) => {
							this.setState({game: {...this.state.game, image: e.currentTarget.value}});
						}}/>
						</div>
						<Feild name="General Rules" type="text" defaultValue={this.state.game.rules} onChange={(e) => {
							this.setState({game: {...this.state.game, rules: e.currentTarget.value}});
						}}/>
					</header>
					<section className="rulesets">
						{
							this.state.rulesets.map((ruleset, i) => {
								return (
									<section key={ruleset.key} className="ruleset-feild">
										<Feild name="Ruleset Name" type="text" defaultValue={ruleset.title} onChange={(e) => {
											this.setState(prevState => {
												let rulesets = Object.assign([] as RulesetDTO[], prevState.rulesets);
												rulesets[i].title = e.target.value;
												return { rulesets: rulesets }
											});
										}} />
										<Feild name="Ruleset Rules" type="text" defaultValue={ruleset.rules} onChange={(e) => {
											this.setState(prevState => {
												let rulesets = Object.assign([] as RulesetDTO[], prevState.rulesets);
												rulesets[i].rules = e.target.value;
												return { rulesets: rulesets }
											});
										}} />
										<section className="columns">
											{
												ruleset.columns.map((column, ci) => {
													return (
														<div key={column.id} className="column-feild">
															<Feild name="Column Name" type="text" defaultValue={column.name} onChange={(e) => {
																this.setState(prevState => {
																	let rulesets = Object.assign([] as RulesetDTO[], prevState.rulesets);
																	rulesets[i].columns[ci].name = e.target.value;
																	return { rulesets: rulesets }
																});
															}}/>
															<label htmlFor={column.id}>Type</label>
															<select id={column.id} name="type" defaultValue={column.type}  onChange={(e) => {
																this.setState(prevState => {
																	let rulesets = Object.assign([] as RulesetDTO[], prevState.rulesets);
																	let newCol = rulesets[i].columns.find(col => col.id === column.id);
																	if(newCol) {
																		newCol.type = (e.target.value as unknown) as Column['type'];
																		return { rulesets: rulesets };
																	}
																	return {...prevState};
																});
															}}>
																<option value="number">Number</option>
																<option value="string">String</option>
																<option value="vod">VOD</option>
																<option value="boolean">Boolean</option>
															</select>
														</div>
													);
												})
											}
										</section>
										<footer>
											<Button variant="text" onClick={(e) => {
												this.setState(prevState => {
													let rulesets = Object.assign([] as RulesetDTO[], prevState.rulesets);
													let rule = rulesets.find(r => r.key === ruleset.key);
													if(rule) {
														rule.columns.push({id: (rule.key + (rule.columns.length + 1)), name: "", type: "string", ruleset: ""})
														return {...prevState, rulesets: rulesets};
													}
												});
											}}>Add Column</Button>
											<Button variant="text" color="rgb(252, 92, 92)" onClick={() => {
												this.setState(prevState => {
													let rulesets = Object.assign([] as RulesetDTO[], prevState.rulesets);
													return { rulesets: rulesets.filter(rule => rule.key !== ruleset.key) }
												});
											}}>Remove Ruleset</Button>
										</footer>
									</section>
								);
							})
						}
					</section>
					<footer>
						<ButtonGroup>
							<Button variant="primary" onClick={() => {
								this.setState(prevState => {
									let rulesets = Object.assign([] as RulesetDTO[], prevState.rulesets);
									rulesets.push({key: Date.now().toString(), title: "", rules: "", columns: [] });
									return { rulesets: rulesets };
								});
							}}>Add Ruleset</Button>
							<Button variant="primary" onClick={async () => {
								let game = await (await axios.post<GameRequestDTO, AxiosResponse<Game>>(`${API_ENDPOINT}/games`, { ...this.state.game, rulesets: this.state.rulesets })).data;
								await this.addGame(game);
							}}>Create Game</Button>
						</ButtonGroup>
					</footer>
				</section>
			</Page>
		);
	}
}