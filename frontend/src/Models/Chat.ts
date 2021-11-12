import { Message, Server } from ".";

export default interface Chat {
	chatId: string;
	name: string;
	serverID: Server['serverID'];
	messages: Message[];
}