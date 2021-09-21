import Column from "./Column";

export default interface ColumnValue {
    id: string;
    columnId: Column['id'];
    value: any;
}