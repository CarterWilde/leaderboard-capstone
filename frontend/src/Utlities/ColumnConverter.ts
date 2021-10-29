import { Column, ColumnValue, Duration, VOD } from "../Models";

export type ConvertableTypes = Number | string | Duration | Date | Boolean | VOD;

export default class ColumnConverter {
	static Convert(value: ColumnValue['value'], type: Column['type']): ConvertableTypes {
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
			case "number":
			case "sbyte":
				try {
					return Number(value);
				} catch (e) {
					console.warn("Value maybe wrong type.");
					try {
						return Number.parseInt(value);
					} catch (e) {
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
		if (type) {
			return ColumnConverter.Convert(valueColumn.value, type);
		}
		throw new Error(`No type found for value ${valueColumn.value}`);
	}

	static ToDefaultValue(column: Column): any {
		switch (column.type.toLowerCase()) {
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
			case "number":
			case "sbyte":
				return 0;
			case "char":
			case "string":
				return "";
			case "boolean":
				return false;
			case "duration":
				return new Duration(0);
			case "date":
				return new Date();
			case "vod":
				return new VOD("");
			default:
				throw new Error(`No default for type '${column.type}'`)
		}
	}

	static ToHTMLInputType(column: Column): string {
		switch (column.type.toLowerCase()) {
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
			case "number":
				return "number";
			case "char":
			case "string":
				return "text";
			case "boolean":
				return "checkbox";
			case "duration":
				return "number";
			case "date":
				return "date";
			case "vod":
				return "url";
			default:
				throw new Error(`No Input Type for ${column.type.toLowerCase()}`)
		}
	}
}