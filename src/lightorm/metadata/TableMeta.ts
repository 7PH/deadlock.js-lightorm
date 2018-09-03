import {KEY} from "../decorator/LightORM";
import {ColumnMeta} from "./ColumnMeta";

export class TableMeta {

    public static initTableMeta(target: any): TableMeta {

        if (Reflect.hasOwnMetadata(KEY, target)) {
            // metadata is already present on this object
            return Reflect.getOwnMetadata(KEY, target);

        } else if (Reflect.hasMetadata(KEY, target)) {
            // metadata is present in superclass
            let meta = new TableMeta(Reflect.getMetadata(KEY, target));
            Reflect.defineMetadata(KEY, meta, target);
            return meta;

        } else {
            // metadata is not present there or in any superclass
            let meta = new TableMeta();
            Reflect.defineMetadata(KEY, meta, target);
            return meta;
        }
    }

    public table: string = '';

    public columns: ColumnMeta[] = [];

    constructor(public readonly parent?: TableMeta) { }

    getAllColumns(): ColumnMeta[] {
        let columns: ColumnMeta[] = [];

        // parent columns
        if (this.parent)
            columns = columns.concat(this.parent.getAllColumns());

        // own columns
        columns = columns.concat(this.columns);

        return columns;
    }
}