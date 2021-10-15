import Run from "./Run";

export default interface Ruleset {
    rulesetID: string;
    gameId: string;
    name: string;
    rules: string;
    runs: Run[]
}