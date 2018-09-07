
export abstract class PropertyExporter<U=any, T=any> {

    public abstract export(value: U): T;

    public abstract import(value: T): U;
}