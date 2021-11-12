import { Component } from "react";
import { NavLink, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Server } from "../../../Models";
import { ServerIcon } from "../../UI";
import { RootState } from '../../../store';
import { connect } from "react-redux";
import { Add, GroupAddOutlined, ExitToApp } from "@material-ui/icons";
import { PropsFromRedux } from "../../../App";
import { ServerPage } from "..";
import { CreateServer, JoinServer } from "../../PopUps";
import { logout } from "../../../reducers";

export interface HomePageProps extends PropsFromRedux {
}

export type HomePageState = {
	openCreateServer: boolean;
	openJoinServer: boolean;
}

class HomePage extends Component<HomePageProps, HomePageState> {
	constructor(props: HomePageProps) {
		super(props);

		this.state = {
			openCreateServer: false,
			openJoinServer: false
		}
	}

	mapServersToLink(servers: Server[]) {
		return servers.map(server => {
			return (
				<NavLink to={`/${server.serverID}`} title={server.name} key={server.serverID} className="server-icon-parent" isActive={(match, location) => {
					if (match) return true;
					if (location.pathname === '/') return true;
					return false;
				}}>
					<ServerIcon icon={server.icon} />
				</NavLink>
			);
		});
	}
	render() {
		switch (this.props.servers.loading) {
			case "done":
				return (
					<div id="home">
						<CreateServer open={this.state.openCreateServer} onClosed={() => {this.setState({openCreateServer: false})}}/>
						<JoinServer open={this.state.openJoinServer} onClosed={() => {this.setState({ openJoinServer: false })}}/>
						<Router>
							<aside id="serverNavigation">
								{this.mapServersToLink(this.props.servers.data)}
								<ServerIcon key="joinServer" icon={<GroupAddOutlined />} onClick={() => this.setState({ openJoinServer: true })} />
								<ServerIcon key="createServer" icon={<Add />} onClick={() => this.setState({ openCreateServer: true })} />
								<ServerIcon key="logout" style={{color: "#fc5c5c"}} icon={<ExitToApp />} onClick={() => {
									this.props.dispatch(logout())
								}}/>
							</aside>
							<Switch>
								{this.props.servers.data.map(server => {
									return (
										<Route key={server.serverID} path={`/${server.serverID}`} render={props => (
											<ServerPage {...props} server={server} />
										)} />
									);
								})}
								<Route key="home" path="/" render={routeProps => (
									<ServerPage {...routeProps} server={this.props.servers.data[0]} />
								)} />
							</Switch>
						</Router>
					</div>
				);
			case "error":
				return (<div>There was an error loading servers!</div>);
			case "loading":
				return <div>Loading...</div>;
		}
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export default connector(HomePage);