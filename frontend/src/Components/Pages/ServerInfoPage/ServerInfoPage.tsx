import { AccountTreeOutlined, Add } from "@material-ui/icons";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Server, Runner } from "../../../Models";
import { IDTranslator } from "../../../Utlities/IDTranslators";
import { Button, Card, Feild, GameCard, Page, UserCard } from "../../UI";
import "./ServerInfoPage.css"

export interface ServerInfoPageProps extends RouteComponentProps {
	server: Server;
}

export type ServerInfoPageState = {
	owner?: Runner;
}

export default class ServerInfoPage extends Component<ServerInfoPageProps, ServerInfoPageState> {
	constructor(props: ServerInfoPageProps) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {
		this.setState({owner: await IDTranslator<Runner>(this.props.server.owner, `${API_ENDPOINT}/runners/@:`)})
	}

	render() {
		// const members: Runner[] = [];

		// TODO: Get server members!
		// this.props.server.games.map(game => {
		//     return game.categories.map(category => {
		//         return category.runs.map(run => {
		//             const {runner} = run;
		//             if(!members.find(member => member.id === runner.id)) {
		//                 members.push(runner);
		//             }
		//         })
		//     })
		// })

		return (
			<Page className="info" title="Server Info" icon={<AccountTreeOutlined />}>
				<section className="games">
					<h3>Games</h3>
					<section>
						{
							this.props.server.games.map(game => (
								<GameCard key={game.id} title={game.name} image={game.image} />
							))
						}
						<Card className="add flair-hover">
							<Add />
						</Card>
					</section>
				</section>
				<hr />
				<section className="moderators">
					<h3>Moderators</h3>
					<section>
						{ this.state.owner ? <UserCard user={this.state.owner} isOwner /> : <></> }
						{/* {
							this.props.server.moderators.map(mod => (
								<UserCard key={mod.id} user={mod} />
							))
						} */}
						<Card className="add flair-hover">
							<Add />
						</Card>
					</section>
				</section>
				<hr />
				<section className="members">
					<h3>Members</h3>
					<section>
						{ this.state.owner ? <UserCard user={this.state.owner} isOwner /> : null}
					</section>
				</section>
				<hr />
				<section className="settings">
					<h3>Settings</h3>
					<section className="feilds">
						<Feild name="Server Name" type="text" />
					</section>
					<section className="buttons">
						<Button variant="text" color="white">Cancel</Button>
						<Button variant="filled">Save Changes</Button>
					</section>
				</section>
				<hr />
			</Page>
		);
	}
}