import Category from "./Category";
import ColumnValue from "./ColumnValue";
import User from "./User";

export default interface Run {
    id: string;
    categoryId: Category['id'];
    runner: User
    values: ColumnValue[];
}