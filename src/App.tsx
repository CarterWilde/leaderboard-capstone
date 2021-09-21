import { useState } from 'react';
import './App.css';
import {
    PopUp, 
    TextedIcon, 
    Feild, 
    GameCard, 
    ButtonGroup, 
    Button, 
    ServerIcon,
} from './Components/UI';
import { Add, GamepadOutlined, GroupAddOutlined } from '@material-ui/icons';
import data from "./dummy-data.json";
import {
    Switch,
    BrowserRouter as Router,
    NavLink,
    Route
} from 'react-router-dom';
import { Server } from './Models';
import ServerPage from './Components/Pages/ServerPage/ServerPage';

const mapServersToLink = (servers: Server[]) => {
    return servers.map(server => {
        return(
            <NavLink to={`/${server.id}`} key={server.id} className="server-icon-parent" isActive={(match, location) => {
                if(match) return true;
                if(location.pathname === '/') return true;
                return false;
            }}>
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
                    {mapServersToLink((data.servers as unknown[]) as Server[])}
                    <ServerIcon key="joinServer" icon={<GroupAddOutlined/>} onClick={() => setOpen(true)}/>
                    <ServerIcon key="createServer" icon={<Add/>} onClick={() => setOpen(true)}/>
                </aside>
                <Switch>
                    {((data.servers as unknown[]) as Server[]).map(server => {
                        return (
                            <Route key={server.id} path={`/${server.id}`} render={props => (
                                <ServerPage {...props} server={server}/>
                            )}/>
                        );
                    })}
                    <Route path={`/`} render={props => (
                        <ServerPage {...props} server={(data.servers[0] as unknown) as Server}/>
                    )}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
