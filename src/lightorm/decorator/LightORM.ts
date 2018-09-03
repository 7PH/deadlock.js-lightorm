import "reflect-metadata";
import {TableMeta} from "../metadata/TableMeta";
import {ColumnMeta} from "../metadata/ColumnMeta";


export class LightORM {

    public static readonly KEY: string = 'lightorm:meta';

    public static Table(name?: string) {
        return function decorator(constructor: any): void {

            const classMeta = TableMeta.initTableMeta(constructor);
            classMeta.table = name || constructor.name;
        }
    }

    public static Column(name?: string) {
        return function decorator(instance: any, prop: string): void {

            const classMeta = TableMeta.initTableMeta(instance.constructor);
            classMeta.columns.push(new ColumnMeta(prop, name || prop));
        }
    }
}

export const KEY = LightORM.KEY;
export const Table = LightORM.Table;
export const Column = LightORM.Column;