import { Chat } from ".";
import Game from "./Game";
import Runner from "./Runner";

export default interface Server {
    serverID: string;
    name: string;
    icon: string;
    owner: Runner['runnerID'];
    moderators: Runner[];
		members: Runner[];
    games: Game[];
		chats: Chat[];
}