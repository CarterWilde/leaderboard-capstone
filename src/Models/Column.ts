import Category from "./Category";

export default interface Column {
    id: string;
    name: string;
    category?: Category['id']
}