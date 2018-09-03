import {PropertyMeta} from "./PropertyMeta";


export class DatePropertyMeta extends PropertyMeta<Date, number> {

    export(value: Date): number {
        return value.getTime();
    }

    import(value: number): Date {
        return new Date(value);
    }
}