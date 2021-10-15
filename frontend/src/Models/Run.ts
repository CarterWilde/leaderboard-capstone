import Ruleset from "./Ruleset";
import ColumnValue from "./ColumnValue";
import Runner from "./Runner";

export default interface Run {
    id: string;
    categoryId: Ruleset['rulesetID'];
    runner: Runner
    values: ColumnValue[];
}