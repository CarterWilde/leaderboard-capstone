import { Add, GamepadOutlined } from "@material-ui/icons";
import { Component } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Server, Game, Ruleset, Runner } from "../../../Models";
import { SubmitRun } from "../../PopUps";
import { Accordion, AccordionItem, Button, ButtonGroup, GameCard, Leaderboard, Page, TextedIcon, UserCard, AddCard } from "../../UI";
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm";
import "./GamePage.css"
import { isServerOwner } from "../../../Utlities/AuthenticationChecks";
import { PropsFromRedux } from "../../../App";
import { connect } from "react-redux";
import { RootState } from "../../../store";
import IDBTranslator from "../../../Utlities/IDBTranslators";
import { API_ENDPOINT } from "../../../EnviormentVariables";

export interface GamePageProps extends RouteComponentProps, PropsFromRedux {
	server: Server;
	game: Game;
	ruleset: Ruleset;
}

export type GamePageState = {
	submitRunOpen: boolean;
	owner?: Runner;
}

class GamePage extends Component<GamePageProps, GamePageState> {
	constructor(props: GamePageProps) {
		super(props);

		this.state = {
			submitRunOpen: false,
			owner: undefined
		}
	}
	
	async componentDidMount() {
		this.setState({ owner: await IDBTranslator<Runner>(this.props.server.owner, `${API_ENDPOINT}/runners/@:`) })
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
								<ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>{this.props.game.rules}</ReactMarkdown>
							</AccordionItem>
							<AccordionItem title="Category Rules">
								<ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>{this.props.ruleset.rules}</ReactMarkdown>
							</AccordionItem>
						</Accordion>
					</section>
					<section className="moderators">
						<h3>Moderators</h3>
						<section>
							{this.state.owner ? <UserCard user={this.state.owner} isOwner /> : null}
							{
								this.props.server.moderators.map(mod => (
									<UserCard key={mod.id} user={mod} />
								))
							}
							{ isServerOwner(this.props, this.props.server) ? <AddCard variant="outline" /> : null}
						</section>
					</section>
				</header>
				<Leaderboard ruleset={this.props.ruleset} runs={this.props.game.runs} />
			</Page>
		);
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export default connector(GamePage);