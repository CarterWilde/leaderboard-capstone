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
                <GameCard title="Super Mario 64" image="https://www.speedrun.com/gameasset/o1y9wo6q/cover" style={{ maxHeight: "300px", margin: "5% 0" }}></GameCard>
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
                        <Route exact path="/8932/1">
                            <Page title={data.servers[0].games[0].name} icon={<GamepadOutlined />}>
                                <Accordion style={{margin: "25px 5%"}}>
                                    <AccordionItem title="Category Rules" bolded>
                                        <Accordion>
                                            <AccordionItem title="Goal">
                                                <p>Finish the Easter Egg</p>
                                            </AccordionItem>
                                        </Accordion>
                                    </AccordionItem>
                                    <AccordionItem title="Game Rules" bolded>
                                        <p>Dont' get VAC banned...</p>
                                    </AccordionItem>
                                </Accordion>
                            </Page>
                        </Route>
                    </Switch>
                </section>
            </Router>
        </div>
    );
}

export default App;
