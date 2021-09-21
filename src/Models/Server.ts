import Game from "./Game";
import User from "./User";

export default interface Server {
    id: string;
    name: string;
    icon: string;
    owner: User;
    games: Game[];
}