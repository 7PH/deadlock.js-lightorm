import {PropertyMeta} from "./PropertyMeta";
import {Exporter} from "../../Exporter";

export class ClassPropertyMeta<T> extends PropertyMeta<T, any> {

    private Obj: { new(): T };

    constructor(prop: string, Obj: new () => T) {
        super(prop);

        this.Obj = Obj;
    }

    export(value: T): any {
        return Exporter.export(value);
    }

    import(value: any): T {
        return Exporter.import(this.Obj, value);
    }

}