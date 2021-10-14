import axios from "axios";
import { useState } from "react";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Feild, PopUp } from "../../UI";

export type JoinServerProps = {
	open: boolean;
	onClosed: () => void;
};

export const JoinServer = (props: JoinServerProps) => {
	const [code, setCode] = useState("");
	return (
		<PopUp
			title="Join Server"
			progressText="Join Server"
			onProgress={async () => {
				try {
					let serverId = await (await axios.put(`${API_ENDPOINT}/servers/join/${code}`)).data as string;
					window.location.href = `/${serverId}`;
				} catch(e) {
					console.log("Invalid Code!");
				}
			}}
			width="24%"
			{...props}
		>
			<Feild style={{ padding: "12px 0px" }} name="Invite Code" type="text" onChange={(e) => {
				setCode(e.currentTarget.value);
			}}/>
		</PopUp>
	);
}

export default JoinServer;