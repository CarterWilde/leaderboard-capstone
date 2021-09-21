import Category from "./Category";

export default interface Column {
    id: string;
    name: string;
    type: string;
    category?: Category['id']
}