import {LIGHTORM_KEY} from "../decorator";
import {ColumnMeta} from "./ColumnMeta";

export class TableMeta {

    public static initTableMeta(target: any): TableMeta {

        if (Reflect.hasOwnMetadata(LIGHTORM_KEY, target)) {
            // metadata is already present on this object
            return Reflect.getOwnMetadata(LIGHTORM_KEY, target);

        } else if (Reflect.hasMetadata(LIGHTORM_KEY, target)) {
            // metadata is present in superclass
            let meta = new TableMeta(Reflect.getMetadata(LIGHTORM_KEY, target));
            Reflect.defineMetadata(LIGHTORM_KEY, meta, target);
            return meta;

        } else {
            // metadata is not present there or in any superclass
            let meta = new TableMeta();
            Reflect.defineMetadata(LIGHTORM_KEY, meta, target);
            return meta;
        }
    }

    public static getTableMeta(target: any): TableMeta | undefined {

        return Reflect.getMetadata(LIGHTORM_KEY, target);
    }

    public table: string = '';

    public columns: ColumnMeta[] = [];

    constructor(public readonly parent?: TableMeta) { }

    getAllColumns(): ColumnMeta[] {
        let columns: ColumnMeta[] = [];

        // parent fieldsMeta
        if (this.parent)
            columns = columns.concat(this.parent.getAllColumns());

        // own fieldsMeta
        columns = columns.concat(this.columns);

        return columns;
    }
}