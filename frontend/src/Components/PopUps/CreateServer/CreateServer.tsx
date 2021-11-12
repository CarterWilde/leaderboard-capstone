import axios, { AxiosResponse } from "axios";
import { Component } from "react";
import { connect } from "react-redux";
import { PropsFromRedux } from "../../../App";
import { API_ENDPOINT } from "../../../EnviormentVariables";
import { Server } from "../../../Models";
import { addServer } from "../../../reducers";
import { RootState } from "../../../store";
import { Feild, PopUp } from "../../UI";
import '@brainhubeu/react-carousel/lib/style.css';

export interface CreateServerProps extends PropsFromRedux {
	open: boolean;
	onClosed: () => void;
};

export type CreateServerState = {
	name: string;
	icon: string;
};

class CreateServer extends Component<CreateServerProps, CreateServerState> {
	 constructor(props: CreateServerProps) {
		 super(props);
		 this.state = {
			 name: "",
			 icon: ""
		 }

		 this.onProgress = this.onProgress.bind(this);
	 }

	async onProgress() {
		var response = await axios.post<{Name: string, Icon: string}, AxiosResponse<Server>>(`${API_ENDPOINT}/servers`, {
			Name: this.state.name,
			Icon: this.state.icon
		});
		this.props.dispatch(addServer(response.data));
	};

	render() {
		return (
			<PopUp
				title="Create Server"
				progressText="Create Server"
				width="24%"
				onProgress={this.onProgress}
				{...this.props}
			>
				<p style={{ padding: "12px 0" }}>Make this server yours!</p>
				<Feild style={{ padding: "12px 0px" }} name="Name" type="text" onChange={(e) => { this.setState({name: e.currentTarget.value}) }} />
				<Feild style={{ paddingBottom: "12px" }} name="Icon" type="url" onChange={(e) => { this.setState({icon: e.currentTarget.value}) }} />
			</PopUp>
		);
	}
}

const connector = connect(
	(state: RootState) => ({ ...state })
);

export default connector(CreateServer);