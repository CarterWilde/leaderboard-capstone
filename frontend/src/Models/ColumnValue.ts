import Column from "./Column";

export default interface ColumnValue {
    id: string;
    columnID: Column['columnID'];
    value: any;
}