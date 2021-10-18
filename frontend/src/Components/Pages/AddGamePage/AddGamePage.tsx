import { Settings } from "@material-ui/icons";
import axios, { AxiosResponse } from "axios";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Game, Server } from "../../../Models";
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
										<footer>
											<Button variant="text" color="rgb(252, 92, 92)" onClick={() => {
												this.setState(prevState => {
													let rulesets = Object.assign([] as RulesetDTO[], prevState.rulesets);
													return { rulesets: rulesets.filter(rule => rule.key !== ruleset.key) }
												});
												this.forceUpdate();
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
									rulesets.push({key: Date.now().toString(), title: "", rules: "" });
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