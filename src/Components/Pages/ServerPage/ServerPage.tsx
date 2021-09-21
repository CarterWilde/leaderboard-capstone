import { AccountTreeOutlined, GamepadOutlined } from "@material-ui/icons";
import { Component } from "react";
import { NavLink, Route, RouteComponentProps } from "react-router-dom";
import { Server } from "../../../Models";
import { TextedIcon } from "../../UI";
import GamePage from "../GamePage/GamePage";
import "./ServerPage.css"

export interface ServerPageProps extends RouteComponentProps {
    server: Server;
}

export type ServerPageState = {

}

export default class ServerPage extends Component<ServerPageProps, ServerPageState> {
    render() {
        return(
            <>
                <section id="pageLinks">
                    <h1>{this.props.server.name}</h1>
                    <hr/>
                    <NavLink to={`/${this.props.server.id}/settings`}>
                        <TextedIcon icon={<AccountTreeOutlined/>}>Server Info</TextedIcon>
                    </NavLink>
                    <hr/>
                    {this.props.server.games.map(game => {
                        return (
                            <NavLink to={`/${this.props.server.id}/${game.id}/${game.categories[0].id}`} key={game.id} isActive={(match, location) => {
                                return location.pathname.startsWith(`/${this.props.server.id}/${game.id}/`);
                            }}>
                                <TextedIcon icon={<GamepadOutlined/>}>{game.name}</TextedIcon>
                            </NavLink>
                        );
                    })}
                </section>
                <section id="serverPage">
                    {this.props.server.games.map(game => (
                        game.categories.map(category => (
                        <Route key={this.props.server.id + game.id + category.id} path={`/${this.props.server.id}/${game.id}/${category.id}`} render={props => (
                            <GamePage {...props} server={this.props.server} game={game} category={category}/>
                        )}/>))
                    ))}
                </section>
            </>
        );
    }
}