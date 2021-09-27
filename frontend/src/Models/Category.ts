import Run from "./Run";

export default interface Category {
    id: string;
    gameId: string;
    isPreset: boolean;
    name: string;
    rules: string;
    runs: Run[]
}