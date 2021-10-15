import Run from "./Run";

export default interface Ruleset {
    rulesetID: string;
    gameId: string;
    title: string;
    rules: string;
    runs: Run[]
}