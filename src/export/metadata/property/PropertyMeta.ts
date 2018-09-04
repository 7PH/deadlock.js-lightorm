
export abstract class PropertyMeta<U, T> {

    public readonly prop: string;

    public optional: boolean = false;

    constructor(prop: string) {

        this.prop = prop;
    }

    public abstract export(value: U): T;

    public abstract import(value: T): U;
}