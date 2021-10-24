import { Add, GamepadOutlined } from "@material-ui/icons";
import axios from "axios";
import { Component } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Server, Game, Ruleset } from "../../../Models";
import { Accordion, AccordionItem, Button, ButtonGroup, GameCard, Leaderboard, Page, TextedIcon } from "../../UI";
import "./GamePage.css"

export interface GamePageProps extends RouteComponentProps {
	server: Server;
	game: Game;
	ruleset: Ruleset;
}

export type GamePageState = {
}

export default class GamePage extends Component<GamePageProps, GamePageState> {
	render() {
		const aside = <TextedIcon style={{fontWeight: "lighter", fontSize: "24px", color: "#5cfcac", cursor: "pointer"}} icon={<Add/>} onClick={
			() => {
				axios.put(`${API_ENDPOINT}/servers/${this.props.server.serverID}/${this.props.game.gameID}/${this.props.ruleset.rulesetID}/runs/add`, {
					RunTime: (40*60000) + (19*1000) + 690,
					VideoUrl: "https://youtu.be/nbhgyr9mcec"
				}).then(() => {
					window.location.reload();
				})
			}
		}>Submit Run</TextedIcon>;
		return (
			<Page className="game" title={this.props.game.title} icon={<GamepadOutlined />} aside={aside}>
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
				<Leaderboard ruleset={this.props.ruleset} runs={[]} />
			</Page>
		);
	}
}