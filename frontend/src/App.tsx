import { Component } from 'react';
import './App.css';
import {
	PopUp,
	Feild,
	ServerIcon,
} from './Components/UI';
import { Add, GroupAddOutlined } from '@material-ui/icons';
import {
	Switch,
	BrowserRouter as Router,
	NavLink,
	Route
} from 'react-router-dom';
import { Server } from './Models';
import ServerPage from './Components/Pages/ServerPage/ServerPage';
import { RootState, store } from './store';
import { connect, ConnectedProps } from 'react-redux';
import { fetchServers } from './reducers';
const mapServersToLink = (servers: Server[]) => {
	return servers.map(server => {
		return (
			<NavLink to={`/${server.serverID}`} key={server.serverID} className="server-icon-parent" isActive={(match, location) => {
				if (match) return true;
				if (location.pathname === '/') return true;
				return false;
			}}>
				<ServerIcon icon={server.icon} />
			</NavLink>
		);
	});
}

export type AppState = {
	openCreateServer: boolean;
	openJoinServer: boolean;
};

class App extends Component<PropsFromRedux, AppState> {
	constructor(props: PropsFromRedux) {
		super(props);
		
		this.state = {
			openCreateServer: false,
			openJoinServer: false
		}
	}
	
	async componentDidMount() {
		await store.dispatch(fetchServers());
	}

	render () {
		switch (this.props.servers.loading) {
			case "done":		
				return (
					<div id="app">
						<PopUp open={this.state.openCreateServer}
							title="Create Server"
							progressText="Create Server"
							width="24%"
							onClosed={() => { this.setState({openCreateServer: false}) }}
						>
							<p style={{ padding: "12px 0" }}>Make this server yours!</p>
							<Feild style={{ padding: "12px 0px" }} name="Server Name" type="text" />
						</PopUp>
						<PopUp open={this.state.openJoinServer}
							title="Join Server"
							progressText="Join Server"
							width="24%"
							onClosed={() => { this.setState({openJoinServer: false}) }}
						>
							<p style={{ padding: "12px 0" }}>Make this server yours!</p>
							<Feild style={{ padding: "12px 0px" }} name="Invite Code" type="text" />
						</PopUp>
						<Router>
							<aside id="serverNavigation">
								{mapServersToLink(this.props.servers.data)}
								<ServerIcon key="joinServer" icon={<GroupAddOutlined />} onClick={() => this.setState({openJoinServer: true}) } />
								<ServerIcon key="createServer" icon={<Add />} onClick={() => this.setState({openCreateServer: true})} />
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
				return(<div>There was an error loading servers!</div>);
			case "loading":
				return <div>Loading...</div>;
		}
	}
}


const connector = connect(
	(state: RootState) => ({ ...state })
);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
