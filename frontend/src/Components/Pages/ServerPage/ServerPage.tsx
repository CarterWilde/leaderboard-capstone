import { AccountTreeOutlined, GamepadOutlined } from "@material-ui/icons";
import { Component } from "react";
import { NavLink, Route, RouteComponentProps } from "react-router-dom";
import { ServerInfoPage, GamePage } from "..";
import { Server } from "../../../Models";
import { TextedIcon } from "../../UI";
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
					<hr />
					{this.props.server.games.map(game => {
						return (
							<NavLink to={`/${this.props.server.serverID}/${game.id}/${game.categories[0].id}`} key={game.id} isActive={(match, location) => {
								return location.pathname.startsWith(`/${this.props.server.serverID}/${game.id}/`);
							}}>
								<TextedIcon icon={<GamepadOutlined />}>{game.name}</TextedIcon>
							</NavLink>
						);
					})}
				</section>
				<section id="serverPage">
					<Route exact path={`/${this.props.server.serverID}/info`} render={props => (
						<ServerInfoPage {...props} server={this.props.server} />
					)} />
					{this.props.server.games.map(game => (
						game.categories.map(category => (
							<Route key={this.props.server.serverID + game.id + category.id} path={`/${this.props.server.serverID}/${game.id}/${category.id}`} render={props => (
								<GamePage {...props} server={this.props.server} game={game} category={category} />
							)} />
						))
					))}
				</section>
			</>
		);
	}
}