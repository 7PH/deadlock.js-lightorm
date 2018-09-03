import "reflect-metadata";
import {TableMeta} from "../metadata";
import {ColumnMeta} from "../metadata";


export class LightORM {

    public static readonly LIGHTORM_KEY: string = 'lightorm:meta';

    public static Table(name?: string) {
        return function decorator(constructor: any): void {

            const classMeta = TableMeta.initTableMeta(constructor);
            classMeta.table = name || constructor.name;
        }
    }

    public static Column(name?: string) {
        return function decorator(instance: any, prop: string): void {

            const tableMeta = TableMeta.initTableMeta(instance.constructor);
            tableMeta.columns.push(new ColumnMeta(prop, name || prop));
        }
    }
}

export const LIGHTORM_KEY = LightORM.LIGHTORM_KEY;
export const Table = LightORM.Table;
export const Column = LightORM.Column;