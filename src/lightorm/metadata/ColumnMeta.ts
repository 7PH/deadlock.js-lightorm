

export class ColumnMeta {

    // @TODO
    public primary: boolean = false;

    public prop: string;

    public column: string;

    constructor(prop: string, column: string) {

        this.prop = prop;
        this.column = column;
    }
}