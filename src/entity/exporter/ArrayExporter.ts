import {PropertyExporter} from "./PropertyExporter";
import {Exporter} from "./Exporter";

export class ArrayExporter<U, T> extends PropertyExporter<U[], T[]> {

    private Obj: { new(): U };

    constructor(Obj: new() => U) {
        super();

        this.Obj = Obj;
    }

    export(values: U[]): T[] {
        return values.map(value => Exporter.export(value));
    }

    import(values: T[]): U[] {
        return values.map(value => Exporter.import(this.Obj, value));
    }
}