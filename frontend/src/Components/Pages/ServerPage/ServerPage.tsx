import { AccountTreeOutlined, GamepadOutlined, VerifiedUserOutlined } from "@material-ui/icons";
import { Component } from "react";
import { NavLink, Route, RouteComponentProps } from "react-router-dom";
import { ServerInfoPage, GamePage, VerificationPage } from "..";
import { Server } from "../../../Models";
import { TextedIcon } from "../../UI";
import AddGamePage from "../AddGamePage/AddGamePage";
import ChatPage from "../ChatPage/ChatPage";
import "./ServerPage.css"

export interface ServerPageProps extends RouteComponentProps {
	server: Server;
}

export type ServerPageState = {

}

export default class ServerPage extends Component<ServerPageProps, ServerPageState> {
	render() {
		return (
			<>
				<section id="pageLinks">
					<h1>{this.props.server.name}</h1>
					<hr />
					<NavLink to={`/${this.props.server.serverID}/info`}>
						<TextedIcon icon={<AccountTreeOutlined />}>Server Info</TextedIcon>
					</NavLink>
					<NavLink to={`/${this.props.server.serverID}/verification`}>
						<TextedIcon icon={<VerifiedUserOutlined />}>Verification</TextedIcon>
					</NavLink>
					<hr />
					{this.props.server.games.map(game => {
						return (
							<NavLink to={`/${this.props.server.serverID}/${game.gameID}/${game.rulesets[0].rulesetID}`} key={this.props.server.serverID + game.gameID + game.rulesets[0].rulesetID} isActive={(match, location) => {
								return location.pathname.startsWith(`/${this.props.server.serverID}/${game.gameID}/`);
							}}>
								<TextedIcon icon={<GamepadOutlined />}>{game.title}</TextedIcon>
							</NavLink>
						);
					})}
				</section>
				<section id="serverPage">
					<Route exact path={`/${this.props.server.serverID}/info`} render={props => (
						<ServerInfoPage {...props} server={this.props.server} />
					)} />
					<Route exact path={`/${this.props.server.serverID}/add-game`} render={props => (
						<AddGamePage {...props} server={this.props.server} />
					)} />
					<Route exact path={`/${this.props.server.serverID}/verification`} render={props => (
						<VerificationPage {...props} server={this.props.server} />
					)} />
					<Route exact path={`/${this.props.server.serverID}/chat`} render={props => (
						<ChatPage {...props} chatId="" server={this.props.server}/>
					)} />
					{this.props.server.games.map(game => (
						game.rulesets.map(ruleset => (
							<Route key={this.props.server.serverID + game.gameID + ruleset.rulesetID} path={`/${this.props.server.serverID}/${game.gameID}/${ruleset.rulesetID}`} render={props => (
								<GamePage {...props} server={this.props.server} game={game} ruleset={ruleset} />
								)} />
						))
					))}
				</section>
			</>
		);
	}
}