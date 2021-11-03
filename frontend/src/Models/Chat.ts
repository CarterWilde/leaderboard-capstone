import { Message, Server } from ".";

export default interface Chat {
	name: string;
	server: Server['serverID'];
	messages: Message[];
}