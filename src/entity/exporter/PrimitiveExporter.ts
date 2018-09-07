import {PropertyExporter} from "./PropertyExporter";

export type PrimitiveTypes = number | string | boolean;

export class PrimitiveExporter extends PropertyExporter<PrimitiveTypes, PrimitiveTypes> {

    export(value: PrimitiveTypes): PrimitiveTypes {
        return value;
    }

    import(value: PrimitiveTypes): PrimitiveTypes {
        return value;
    }
}