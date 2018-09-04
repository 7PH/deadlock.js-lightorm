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

    public static Column(data?: string | boolean | Partial<{primary: boolean, name: string}>) {
        return function decorator(instance: any, prop: string): void {

            let opt: {name: string, primary: boolean};
            if (typeof data === "string")
                opt = {name: data, primary: false};
            else if (typeof data === "boolean")
                opt = {name: prop, primary: data};
            else
                opt = Object.assign({name: prop, primary: false}, data);

            const tableMeta = TableMeta.initTableMeta(instance.constructor);
            tableMeta.columns.push(new ColumnMeta(prop, opt.name, opt.primary));
        }
    }
}

export const LIGHTORM_KEY = LightORM.LIGHTORM_KEY;
export const Table = LightORM.Table;
export const Column = LightORM.Column;