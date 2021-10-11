import BackgroundEffect from "../../BackgroundEffect";
import { Button, PopUp } from "../../UI";
import "./NoServersPage.css";

const NoServersPage = () => {
	return(
		<section className="no-servers page" style={{height: "100%"}}>
			<PopUp open isBlank>
				<h3>You're not part of any servers</h3>
				<hr/>
				<section>
					<div>
						<Button variant="inline">Join a server</Button>
						&nbsp;or&nbsp;
						<Button variant="inline">create a server!</Button>
					</div>
				</section>
			</PopUp>
			<BackgroundEffect/>
		</section>
	);
}

export default NoServersPage;