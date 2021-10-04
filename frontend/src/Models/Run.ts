import Category from "./Category";
import ColumnValue from "./ColumnValue";
import Runner from "./Runner";

export default interface Run {
    id: string;
    categoryId: Category['id'];
    runner: Runner
    values: ColumnValue[];
}