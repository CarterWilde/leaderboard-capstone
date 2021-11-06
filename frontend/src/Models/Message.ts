import { Chat, Runner } from ".";

export default interface Message {
	chatId: Chat['chatId']
	poster: Runner;
	publishDate: Date;
	content: string;
}