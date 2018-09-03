
export abstract class PropertyMeta<U, T> {

    public readonly prop: string;

    constructor(prop: string) {

        this.prop = prop;
    }

    public abstract export(value: U): T;

    public abstract import(value: T): U;
}