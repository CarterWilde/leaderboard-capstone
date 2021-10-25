import { Run } from ".";
import Ruleset from "./Ruleset";

export default interface Game {
    gameID: string;
    title: string;
    rules: string;
    image: string;
    rulesets: Ruleset[];
		runs: Run[];
}