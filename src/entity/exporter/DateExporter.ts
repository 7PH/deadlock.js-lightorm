import {PropertyExporter} from "./PropertyExporter";

export class DateExporter extends PropertyExporter<Date, number> {

    public export(value: Date): number {
        return value.getTime();
    }

    public import(value: number): Date {
        return new Date(value);
    }
}