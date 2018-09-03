import {PropertyMeta} from "./PropertyMeta";

export type PrimitiveTypes = number | string | boolean;

export class PrimitivePropertyMeta extends PropertyMeta<PrimitiveTypes, PrimitiveTypes> {

    readonly type = "primitive";

    export(value: any): any { return value; }
    import(value: any): any { return value; }
}