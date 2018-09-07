import {Exporter} from "./Exporter";
import {PropertyExporter} from "./PropertyExporter";

export class ObjectExporter<U, T> extends PropertyExporter<U, T> {

    private readonly Obj: { new(): U };

    constructor(Obj: new () => U) {
        super();

        this.Obj = Obj;
    }

    public export(value: U): T {
        return Exporter.export(value);
    }

    public import(value: T): U {
        return Exporter.import(this.Obj, value);
    }
}