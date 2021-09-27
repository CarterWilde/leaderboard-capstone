import { useState } from 'react';
import './App.css';
import {
    PopUp,
    Feild,
    ServerIcon,
} from './Components/UI';
import { Add, GroupAddOutlined } from '@material-ui/icons';
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
    const [openCreateServer, setOpenCreateServer] = useState(false);
    const [openJoinServer, setOpenJoinServer] = useState(false);
    return (
        <div id="app">
            <PopUp open={openCreateServer}
                title="Create Server"
                progressText="Create Server"
                width="24%"
                onClosed={() => { setOpenCreateServer(false) }}
            >
                <p style={{ padding: "12px 0" }}>Make this server yours!</p>
                <Feild style={{ padding: "12px 0px" }} name="Server Name" type="text"/>
            </PopUp>
            <PopUp open={openJoinServer}
                title="Join Server"
                progressText="Join Server"
                width="24%"
                onClosed={() => { setOpenJoinServer(false) }}
            >
                <p style={{ padding: "12px 0" }}>Make this server yours!</p>
                <Feild style={{ padding: "12px 0px" }} name="Invite Code" type="text"/>
            </PopUp>
            <Router>
                <aside id="serverNavigation">
                    {mapServersToLink((data.servers as unknown[]) as Server[])}
                    <ServerIcon key="joinServer" icon={<GroupAddOutlined/>} onClick={() => setOpenJoinServer(true)}/>
                    <ServerIcon key="createServer" icon={<Add/>} onClick={() => setOpenCreateServer(true)}/>
                </aside>
                <Switch>
                    {((data.servers as unknown[]) as Server[]).map(server => {
                        return (
                            <Route key={server.id} path={`/${server.id}`} render={props => (
                                <ServerPage {...props} server={server}/>
                            )}/>
                        );
                    })}
                    <Route path="/" render={props => (
                        <ServerPage {...props} server={(data.servers[0] as unknown) as Server}/>
                    )}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
