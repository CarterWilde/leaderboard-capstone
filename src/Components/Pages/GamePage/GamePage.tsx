import { GamepadOutlined } from "@material-ui/icons";
import { Component } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Server, Game, Category } from "../../../Models";
import { Accordion, AccordionItem, Button, ButtonGroup, GameCard, Leaderboard, Page } from "../../UI";
import "./GamePage.css"

export interface GamePageProps extends RouteComponentProps {
    server: Server;
    game: Game;
    category: Category;
}

export type GamePageState = {
}

export default class GamePage extends Component<GamePageProps, GamePageState> {
    render() {
        return(
            <Page className="game" title={this.props.game.name} icon={<GamepadOutlined/>}>
                <header>
                    <GameCard image={this.props.game.image} title={this.props.game.name} />
                    <section>
                            <ButtonGroup style={{fontWeight: "lighter"}}>
                                {this.props.game.categories.map(category => {
                                    return <NavLink key={category.id} to={`/${this.props.server.id}/${this.props.game.id}/${category.id}`} className="category-button-parent"><Button>{category.name}</Button></NavLink>
                                })}
                            </ButtonGroup>
                            <Accordion style={{marginTop: "16px"}}>
                                <AccordionItem title="Game Rules">
                                    {this.props.game.rules}
                                </AccordionItem>
                                <AccordionItem title="Category Rules">
                                    {this.props.category.rules}
                                </AccordionItem>
                            </Accordion>
                    </section>
                </header>
                <Leaderboard category={this.props.category} runs={this.props.category.runs}/>
            </Page>
        );
    }
}