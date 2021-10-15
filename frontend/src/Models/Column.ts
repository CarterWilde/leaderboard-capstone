import Ruleset from "./Ruleset";

export default interface Column {
    id: string;
    name: string;
    type: "string" | "int" | "double" | "float" | "decimal" | "uint" | "long" | "ulong" | "short" | "ushort" | "byte" | "sbyte" | "boolean" | "char"  | "duration" | "date" | "vod";
    category?: Ruleset['rulesetID']
}