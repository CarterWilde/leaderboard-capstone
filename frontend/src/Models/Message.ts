import { Runner } from ".";

export default interface Message {
	poster: Runner;
	publishDate: Date;
	content: string;
}