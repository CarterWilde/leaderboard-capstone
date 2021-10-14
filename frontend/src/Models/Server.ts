import Game from "./Game";
import Runner from "./Runner";

export default interface Server {
    serverID: string;
    name: string;
    icon: string;
    owner: Runner['id'];
    moderators: Runner[];
		members: Runner[];
    games: Game[];
}