import { Feild, PopUp } from "../../UI";

export type JoinServerProps = {
	open: boolean;
	onClosed: () => void;
};

export const JoinServer = (props: JoinServerProps) => {
	return (
		<PopUp
			title="Join Server"
			progressText="Join Server"
			width="24%"
			{...props}
		>
			<Feild style={{ padding: "12px 0px" }} name="Invite Code" type="text" />
		</PopUp>
	);
}

export default JoinServer;