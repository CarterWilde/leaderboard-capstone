import Category from "./Category";

export default interface Game {
    id: string;
    name: string;
    isPreset: boolean;
    rules: string;
    image: string;
    categories: Category[]
}