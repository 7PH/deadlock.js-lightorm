import {PropertyMeta} from "./PropertyMeta";
import {Exporter} from "../../Exporter";

export class ArrayPropertyMeta<T> extends PropertyMeta<T[], any[]> {

    private Obj: { new(): T };

    constructor(prop: string, Obj: new() => T) {
        super(prop);

        this.Obj = Obj;
    }

    export(values: any[]): any[] {
        return values.map(value => Exporter.export(value));
    }

    import(values: any[]): any {
        return values.map(value => Exporter.import(this.Obj, value));
    }
}