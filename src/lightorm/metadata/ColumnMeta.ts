

export class ColumnMeta {

    public prop: string;

    public column: string;

    public primary: boolean = false;

    public defaultValue?: any;

    constructor(prop: string, column: string, primary?: boolean, defaultValue?: any) {

        this.prop = prop;
        this.column = column;
        this.primary = !! primary;
        this.defaultValue = defaultValue;
    }
}