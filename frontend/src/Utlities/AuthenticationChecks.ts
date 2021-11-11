import { PropsFromRedux } from "../App";
import { Server } from "../Models";

export const isServerOwner = (props: PropsFromRedux, server: Server['owner'] | Server): boolean  => {
	if(typeof(server) === "string") {
		return props.authentication.runner?.runnerID === server;
	} else {
		return props.authentication.runner?.runnerID === server.owner;
	}
}