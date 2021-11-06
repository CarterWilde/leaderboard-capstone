import { Message, Server } from ".";

export default interface Chat {
	chatId: string;
	name: string;
	server: Server['serverID'];
	messages: Message[];
}