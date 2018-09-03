import {PropertyMeta} from "./PropertyMeta";

export class CustomPropertyMeta<U, T> extends PropertyMeta<U, T> {

    public readonly type = "custom";

    private exportFun: (value: U) => T;

    private importFun: (value: T) => U;

    constructor(prop: string, exportFun: (value: U) => T, importFun: (value: T) => U) {
        super(prop);

        this.exportFun = exportFun;
        this.importFun = importFun;
    }

    public export(value: U): T {
        return this.exportFun(value);
    }

    public import(value: T): U {
        return this.importFun(value);
    }

}