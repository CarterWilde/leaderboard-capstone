import { Column, ColumnValue, Duration, VOD } from "../Models";

export type ConvertableTypes = Number | string | Duration | Date | Boolean | VOD;

export default class ColumnConverter {
    static Convert(value: ColumnValue['value'], type: Column['type']) : ConvertableTypes {
        switch (type.toLowerCase()) {
            case "int":
            case "double":
            case "float":
            case "decimal":
            case "uint":
            case "long":
            case "ulong":
            case "short":
            case "ushort":
            case "byte":
            case "sbyte":
                try {
                    return Number(value);
                } catch (e) {
                    console.warn("Value maybe wrong type.");
                    try {
                        return Number.parseInt(value);
                    } catch(e) {
                        return Number.parseFloat(value);
                    }
                }
            case "char":
            case "string":
                return String(value);
            case "boolean":
                return Boolean(value);
            case "duration":
                return new Duration(value);
            case "date":
                return new Date(value);
            case "vod":
                return new VOD(value);
            default:
                throw new Error(`No conversion for type '${type}'`)
        }
    }

    static Resolve(columns: Column[], valueColumn: ColumnValue): ConvertableTypes {
        const type = columns.find(column => column.id === valueColumn.columnId)?.type;
        if(type) {
            return ColumnConverter.Convert(valueColumn.value, type);
        }
        throw new Error(`No type found for value ${valueColumn.value}`);
    }
}