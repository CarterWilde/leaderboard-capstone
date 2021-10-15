import { GamepadOutlined } from "@material-ui/icons";
import { Component } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Server, Game, Ruleset } from "../../../Models";
import { Accordion, AccordionItem, Button, ButtonGroup, GameCard, Leaderboard, Page } from "../../UI";
import "./GamePage.css"

export interface GamePageProps extends RouteComponentProps {
    server: Server;
    game: Game;
    ruleset: Ruleset;
}

export type GamePageState = {
}

export default class GamePage extends Component<GamePageProps, GamePageState> {
    render() {
        return(
            <Page className="game" title={this.props.game.title} icon={<GamepadOutlined/>}>
                <header>
                    <GameCard image={this.props.game.image} title={this.props.game.title} />
                    <section>
                            <ButtonGroup style={{fontWeight: "lighter"}}>
                                {this.props.game.rulesets.map(category => {
                                    return <NavLink key={category.rulesetID} to={`/${this.props.server.serverID}/${this.props.game.gameID}/${category.rulesetID}`} className="category-button-parent"><Button>{category.name}</Button></NavLink>
                                })}
                            </ButtonGroup>
                            <Accordion style={{marginTop: "16px"}}>
                                <AccordionItem title="Game Rules">
                                    {this.props.game.rules}
                                </AccordionItem>
                                <AccordionItem title="Category Rules">
                                    {this.props.ruleset.rules}
                                </AccordionItem>
                            </Accordion>
                    </section>
                </header>
                <Leaderboard ruleset={this.props.ruleset} runs={this.props.ruleset.runs}/>
            </Page>
        );
    }
}