import { Feild, PopUp } from "../../UI";

export type CreateServerProps = {
	open: boolean;
	onClosed: () => void;
};

export const CreateServer = (props: CreateServerProps) => {
	return (
		<PopUp
			title="Create Server"
			progressText="Create Server"
			width="24%"
			{...props}
		>
			<p style={{ padding: "12px 0" }}>Make this server yours!</p>
			<Feild style={{ padding: "12px 0px" }} name="Server Name" type="text" />
		</PopUp>
	);
}

export default CreateServer;