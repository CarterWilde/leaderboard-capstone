import Ruleset from "./Ruleset";

export default interface Game {
    id: string;
    name: string;
    isPreset: boolean;
    rules: string;
    image: string;
    rulesets: Ruleset[]
}