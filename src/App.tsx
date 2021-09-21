import { useState } from 'react';
import './App.css';
import {
    Accordion,
    PopUp, 
    TextedIcon, 
    Feild, 
    GameCard, 
    ButtonGroup, 
    Button, 
    AccordionItem,
    ServerIcon,
    Page
} from './Components/UI';
import { AccountTreeOutlined, Add, GamepadOutlined, GroupAddOutlined } from '@material-ui/icons';
import data from "./dummy-data.json";
import {
    Switch,
    Route,
    BrowserRouter as Router,
    NavLink
} from 'react-router-dom';

const mapServersToLink = (servers: any[]) => {
    return servers.map(server => {
        return(
            <NavLink to={`/${server.id}`} key={server.id} className="server-icon-parent">
                <ServerIcon icon={server.icon}/>
            </NavLink>
        );
    });
}

const App = () => {
    const [open, setOpen] = useState(false);
    return (
        <div id="app">
            <PopUp open={open}
                title="Test"
                progressText="Continue"
                onClosed={() => { setOpen(false) }}
            >
                <p style={{ padding: "6% 0" }}>Hello!</p>
                <TextedIcon size="24px" icon={<GamepadOutlined />}>Portal</TextedIcon>
                <Feild type="text" name="Invite Code" style={{ marginTop: "12px" }} />
                <GameCard title="Super Mario 64" image="https://www.speedrun.com/gameasset/o1y9wo6q/cover" style={{margin: "5% 0", maxWidth: "200px"}}></GameCard>
                <ButtonGroup>
                    <Button>1</Button>
                    <Button>2</Button>
                    <Button>3</Button>
                </ButtonGroup>
            </PopUp>
            <Router>
                <aside id="serverNavigation">
                    {mapServersToLink(data.servers)}
                    <ServerIcon key="joinServer" icon={<GroupAddOutlined/>} onClick={() => setOpen(true)}/>
                    <ServerIcon key="createServer" icon={<Add/>} onClick={() => setOpen(true)}/>
                </aside>
                <section id="pageLinks">
                    <h1>{data.servers[0].name}</h1>
                    <hr/>
                    <NavLink to={`/${data.servers[0].id}/settings`}>
                        <TextedIcon icon={<AccountTreeOutlined/>}>Server Info</TextedIcon>
                    </NavLink>
                    <hr/>
                    {data.servers[0].games.map(game => {
                        return (
                            <NavLink to={`/${data.servers[0].id}/${game.id}`} key={game.id}>
                                <TextedIcon icon={<GamepadOutlined/>}>{game.name}</TextedIcon>
                            </NavLink>
                        );
                    })}
                </section>
                <section id="serverPages">
                    <Switch>
                        {
                            data.servers.map(server => {
                                return server.games.map(game => {
                                    return(
                                        <Route exact path={`/${server.id}/${game.id}`}>
                                            <Page className="game" title={game.name} icon={<GamepadOutlined/>}>
                                                <header>
                                                    <GameCard image={game.image} title={game.name} />
                                                    <section>
                                                            <ButtonGroup style={{fontWeight: "lighter"}}>
                                                                {game.categories?.map(category => {
                                                                    return <Button>{category.name}</Button>
                                                                })}
                                                            </ButtonGroup>
                                                            <Accordion style={{marginTop: "16px"}}>
                                                                <AccordionItem title="Game Rules">
                                                                    {game.rules}
                                                                </AccordionItem>
                                                                <AccordionItem title="Category Rules">
                                                                    {game.categories[0].rules}
                                                                </AccordionItem>
                                                            </Accordion>
                                                    </section>
                                                </header>
                                            </Page>
                                        </Route>
                                    );
                                });
                            })
                        }
                    </Switch>
                </section>
            </Router>
        </div>
    );
}

export default App;
