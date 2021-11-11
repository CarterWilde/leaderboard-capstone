import { AccountTreeOutlined } from "@material-ui/icons";
import axios, { AxiosResponse } from "axios";
import { Component } from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { PropsFromRedux } from "../../../App";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Server, Runner } from "../../../Models";
import { RootState } from "../../../store";
import { isServerOwner } from "../../../Utlities/AuthenticationChecks";
import { IDBTranslator } from "../../../Utlities/IDBTranslators";
import { AddCard, Button, Feild, GameCard, Page, PopUp, UserCard } from "../../UI";
import "./ServerInfoPage.css"

export interface ServerInfoPageProps extends PropsFromRedux, RouteComponentProps {
	server: Server;
}

type CodeSettings = {
	expires_in?: number;
	uses?: number;
}

export type ServerInfoPageState = {
	owner?: Runner;
	code?: string;
	codeSettings: CodeSettings;
	openCreateCode: boolean;
	openCodePreview: boolean;
	serverName: string;
	serverIcon: string;
}

class ServerInfoPage extends Component<ServerInfoPageProps, ServerInfoPageState> {
	constructor(props: ServerInfoPageProps) {
		super(props);
		this.state = {
			codeSettings: {
				expires_in: 24 * 60 * 60,
				uses: 5
			},
			openCreateCode: false,
			openCodePreview: false,
			serverName: this.props.server.name,
			serverIcon: this.props.server.icon
		};

		this.OnCreateCode = this.OnCreateCode.bind(this);
	}

	async OnCreateCode() {
		let response = await axios.put<CodeSettings, AxiosResponse<string>>(`${API_ENDPOINT}/servers/${this.props.server.serverID}/generate-code`, this.state.codeSettings);
		this.setState({
			code: await response.data
		});
		this.setState({ openCodePreview: true });
	}

	async componentDidMount() {
		this.setState({ owner: await IDBTranslator<Runner>(this.props.server.owner, `${API_ENDPOINT}/runners/@:`) })
	}

	render() {

		return (
			<Page className="info" title="Server Info" icon={<AccountTreeOutlined />}>
				<PopUp
					className="create-code"
					open={this.state.openCreateCode}
					progressText="Create Code"
					title="Create Code"
					onProgress={this.OnCreateCode}
					onClosed={() => {
						this.setState({ openCreateCode: false });
					}}
				>
					<Feild name="Uses"
						type="number"
						defaultValue={this.state.codeSettings.uses}
						onChange={(e) => {
							this.setState({ codeSettings: { ...this.state.codeSettings, uses: e.currentTarget.valueAsNumber } })
						}} />
					<Feild name="Expires In"
						type="number"
						defaultValue={this.state.codeSettings.expires_in}
						onChange={(e) => {
							this.setState({ codeSettings: { ...this.state.codeSettings, expires_in: e.currentTarget.valueAsNumber } })
						}} />
				</PopUp>
				<PopUp
					className="code-preview"
					open={this.state.openCodePreview}
					title="Code"
					cancelText="Close"
					onClosed={() => {
						this.setState({ openCodePreview: false });
					}}
				>
					<b>{this.state.code ? this.state.code : "No code!"}</b>
				</PopUp>
				<section className="games">
					<h3>Games</h3>
					<section>
						{
							this.props.server.games.map(game => (
								<GameCard key={game.gameID} title={game.title} image={game.image} style={{ width: "200px" }} />
							))
						}
						{ isServerOwner(this.props, this.props.server) ? <Link to={`/${this.props.server.serverID}/add-game`}>
							<AddCard style={{height: "100%"}}/>
						</Link> : null}
					</section>
				</section>
				<hr />
				<section className="moderators">
					<h3>Moderators</h3>
					<section>
						{this.state.owner ? <UserCard user={this.state.owner} isOwner /> : null}
						{
							this.props.server.moderators.map(mod => (
								<UserCard key={mod.id} user={mod} />
							))
						}
						{ isServerOwner(this.props, this.props.server) ? <AddCard /> : null}
					</section>
				</section>
				<hr />
				<section className="members">
					<h3>Members</h3>
					<section>
						{this.state.owner ? <UserCard user={this.state.owner} isOwner /> : null}
						{this.props.server.members.filter(runner => runner.id !== this.props.server.owner).map(member => (
							<UserCard user={member} />
						))}
					</section>
				</section>
				<hr />
				{
					 isServerOwner(this.props, this.props.server) ? (
						<section className="settings">
							<h3>Settings</h3>
							<section className="feilds">
								<Feild name="Server Name" type="text" defaultValue={this.state.serverName} onChange={(e) => {
									this.setState({serverName: e.currentTarget.value});
								}}/>
								<Feild name="Server Icon" type="text" defaultValue={this.state.serverIcon} onChange={(e) => {
									this.setState({serverIcon: e.currentTarget.value});
								}}/>
							</section>
							<section className="buttons">
								<Button variant="text" color="white" onClick={() => {
									this.setState({ openCreateCode: true })
								}}>Create Invite Code</Button>
								<Button variant="filled" onClick={() => {
									axios.put(`${API_ENDPOINT}/servers/${this.props.server.serverID}`, {
										Name: this.state.serverName,
										Icon: this.state.serverIcon,
										Owner: this.props.server.owner
									});
								}}>Apply</Button>
							</section>
						</section>
					) : null
				}
				<hr />
			</Page>
		);
	}
}


const connector = connect(
	(state: RootState) => ({ ...state })
);

export default connector(ServerInfoPage);