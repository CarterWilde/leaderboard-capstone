import { Add, GamepadOutlined } from "@material-ui/icons";
import { Component } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Server, Game, Ruleset } from "../../../Models";
import { SubmitRun } from "../../PopUps";
import { Accordion, AccordionItem, Button, ButtonGroup, GameCard, Leaderboard, Page, TextedIcon } from "../../UI";
import "./GamePage.css"

export interface GamePageProps extends RouteComponentProps {
	server: Server;
	game: Game;
	ruleset: Ruleset;
}

export type GamePageState = {
	submitRunOpen: boolean;
}

export default class GamePage extends Component<GamePageProps, GamePageState> {
	constructor(props: GamePageProps) {
		super(props);

		this.state = {
			submitRunOpen: false
		}
	}

	render() {
		const aside = <TextedIcon style={{fontWeight: "lighter", fontSize: "24px", color: "#5cfcac", cursor: "pointer"}} icon={<Add/>} onClick={() => {this.setState({submitRunOpen: true})}}>Submit Run</TextedIcon>;
		return (
			<Page className="game" title={this.props.game.title} icon={<GamepadOutlined />} aside={aside}>
				<SubmitRun serverID={this.props.server.serverID} game={this.props.game} ruleset={this.props.ruleset} open={this.state.submitRunOpen} onClosed={() => {this.setState({submitRunOpen: false})}}/>
				<header>
					<GameCard image={this.props.game.image} title={this.props.game.title} />
					<section>
						<ButtonGroup style={{ fontWeight: "lighter" }}>
							{this.props.game.rulesets.map(ruleset => {
								return <NavLink key={ruleset.rulesetID} to={`/${this.props.server.serverID}/${this.props.game.gameID}/${ruleset.rulesetID}`} className="category-button-parent"><Button>{ruleset.title}</Button></NavLink>
							})}
						</ButtonGroup>
						<Accordion style={{ marginTop: "16px" }}>
							<AccordionItem title="Game Rules">
								{this.props.game.rules}
							</AccordionItem>
							<AccordionItem title="Category Rules">
								{this.props.ruleset.rules}
							</AccordionItem>
						</Accordion>
					</section>
				</header>
				<Leaderboard ruleset={this.props.ruleset} runs={this.props.game.runs} />
			</Page>
		);
	}
}