import { useState } from "react";
import BackgroundEffect from "../../BackgroundEffect";
import { CreateServer, JoinServer } from "../../PopUps";
import { Button, PopUp } from "../../UI";
import "./NoServersPage.css";

const NoServersPage = () => {
	const [openJoinServer, setOpenJoinServer] = useState(false);
	const [openCreateServer, setOpenCreateServer] = useState(false)
	return(
		<section className="no-servers page" style={{height: "100%"}}>
			<JoinServer open={openJoinServer} onClosed={() => {
				setOpenJoinServer(false);
			}}/>
			<CreateServer open={openCreateServer} onClosed={() => {
				setOpenCreateServer(false);
			}}/>
			<PopUp open={!openJoinServer && !openCreateServer} isBlank className="no-servers">
				<h3>You're not part of any servers</h3>
				<hr/>
				<section>
					<div>
						<Button variant="inline" onClick={() => {setOpenJoinServer(true)}}>Join a server</Button>
						&nbsp;or&nbsp;
						<Button variant="inline" onClick={() => {setOpenCreateServer(true)}}>create a server!</Button>
					</div>
				</section>
			</PopUp>
			<BackgroundEffect/>
		</section>
	);
}

export default NoServersPage;