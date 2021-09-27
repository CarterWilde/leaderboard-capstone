import { AccountTreeOutlined, Add } from "@material-ui/icons";
import { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Server, User } from "../../../Models";
import { Button, Card, Feild, GameCard, Page, UserCard } from "../../UI";
import "./ServerInfoPage.css"

export interface ServerInfoPageProps extends RouteComponentProps {
    server: Server;
}

export type ServerInfoPageState = {

}

export default class ServerInfoPage extends Component<ServerInfoPageProps, ServerInfoPageState> {
    render() {
        const members: User[] = [this.props.server.owner];
        
        this.props.server.games.map(game => {
            return game.categories.map(category => {
                return category.runs.map(run => {
                    const {runner} = run;
                    if(!members.find(member => member.id === runner.id)) {
                        members.push(runner);
                    }
                })
            })
        })

        return(
            <Page className="info" title="Server Info" icon={<AccountTreeOutlined/>}>
                <section className="games">
                    <h3>Games</h3>
                    <section>
                        {
                            this.props.server.games.map(game => (
                                <GameCard key={game.id} title={game.name} image={game.image}/>
                            ))
                        }
                        <Card className="add flair-hover">
                            <Add/>
                        </Card>
                    </section>
                </section>
                <hr/>
                <section className="moderators">
                    <h3>Moderators</h3>
                    <section>
                        <UserCard user={this.props.server.owner} isOwner/>
                        {
                            this.props.server.moderators.map(mod => (
                                <UserCard key={mod.id} user={mod}/>
                            ))
                        }
                        <Card className="add flair-hover" style={{aspectRatio: "2.5/1"}}>
                            <Add/>
                        </Card>
                    </section>
                </section>
                <hr/>
                <section className="members">
                    <h3>Members</h3>
                    <section>
                        <UserCard user={this.props.server.owner} isOwner/>
                        {
                            members.filter(member => member.id !== this.props.server.owner.id).map(member => {
                                try {
                                    return <UserCard key={member.id} user={member}/>
                                } catch(e) {
                                    return <></>
                                }
                            })
                        }
                    </section>
                </section>
                <hr/>
                <section className="settings">
                    <h3>Settings</h3>
                    <section className="feilds">
                        <Feild name="Server Name" type="text"/>
                    </section>
                    <section className="buttons">
                        <Button variant="text" color="white">Cancel</Button>
                        <Button variant="filled">Save Changes</Button>
                    </section>
                </section>
                <hr/>
            </Page>
        );
    }
}