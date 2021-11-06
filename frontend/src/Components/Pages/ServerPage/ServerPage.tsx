import { AccountTreeOutlined, GamepadOutlined, VerifiedUserOutlined } from "@material-ui/icons";
import { Component } from "react";
import { NavLink, Route, RouteComponentProps } from "react-router-dom";
import { ServerInfoPage, GamePage, VerificationPage } from "..";
import { Server } from "../../../Models";
import { AddChat } from "../../PopUps";
import { AddCard, TextedIcon } from "../../UI";
import AddGamePage from "../AddGamePage/AddGamePage";
import ChatPage from "../ChatPage/ChatPage";
import "./ServerPage.css"

export interface ServerPageProps extends RouteComponentProps {
	server: Server;
}

export type ServerPageState = {
	isAddChatOpen: boolean;
}

export default class ServerPage extends Component<ServerPageProps, ServerPageState> {
	constructor(props: ServerPageProps) {
		super(props);

		this.state = {
			isAddChatOpen: false
		}
	}
	render() {
		return (
			<>
				<AddChat open={this.state.isAddChatOpen} onClosed={() => {this.setState({isAddChatOpen: false})}} serverID={this.props.server.serverID}/>
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
					{this.props.server.chats.map(chat => {
						return (
							<NavLink to={`/${this.props.server.serverID}/${chat.chatId}`} key={this.props.server.serverID + chat.chatId} isActive={(match, location) => {
								return location.pathname.startsWith(`/${this.props.server.serverID}/${chat.chatId}`);
							}}>
								<TextedIcon icon={<GamepadOutlined />}>{chat.name}</TextedIcon>
							</NavLink>
						);
					})}
					<AddCard onClick={() => {
						this.setState({isAddChatOpen: true});
					}}/>
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
					{this.props.server.chats.map(chat => {
						return (
							<Route key={this.props.server.serverID + chat.chatId} exact path={`/${this.props.server.serverID}/${chat.chatId}`} render={props => (
								<ChatPage {...props} chatId={chat.chatId} server={this.props.server}/>
							)} />
						);
					})}
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