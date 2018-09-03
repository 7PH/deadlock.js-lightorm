import {Connection, MysqlError} from "mysql";
import {TableMeta} from "../metadata";


export class MySQL {

    /**
     *
     * @param {Connection} mysql
     * @param {string} rqt
     * @param data
     * @returns {Promise<any>}
     * @private
     */
    public static async awaitQuery(mysql: Connection, rqt: string, data?: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            mysql.query(rqt, data, (err: MysqlError | null, data: any) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }

    /**
     *
     * @param {Connection} mysql
     * @param {string} rqt
     * @param {{new(data: any): Class}} Construct
     * @param {Array<any>} data
     * @returns {Promise<Class[]>}
     */
    public static async query<Class>(
        mysql: Connection,
        rqt: string,
        Construct: new(data: any) => Class,
        data?: Array<any>
    ): Promise<Class[]> {

        const rows: any[] = await MySQL.awaitQuery(mysql, rqt, data);
        return rows.map(row => new Construct(row));
    }

    /**
     *
     * @param {Connection} mysql
     * @param {string} rqt
     * @param {{new(data: any): Class}} Construct
     * @param {Array<any>} data
     * @returns {Promise<Class>}
     */
    public static async getFirst<Class>(
        mysql: Connection,
        rqt: string,
        Construct: new(data: any) => Class,
        data?: Array<any>
    ): Promise<Class> {

        const rows: any[] = await MySQL.awaitQuery(mysql, rqt, data);
        if (rows.length === 0)
            throw new Error("No result");
        return new Construct(rows[0]);
    }

    /**
     *
     * @param {Connection} mysql
     * @param {string} rqt
     * @param entry
     * @returns {Promise<number>}
     */
    public static async insert(mysql: Connection, rqt: string, entry: any): Promise<number> {

        let result: any = await MySQL.awaitQuery(mysql, rqt, entry);
        return result.insertId;
    }

    /**
     *
     * @param {Connection} mysql
     * @param {string} rqt
     * @param {Array<any>} data
     * @returns {Promise<void>}
     */
    public static async exec(mysql: Connection, rqt: string, data?: Array<any>): Promise<void> {

        await MySQL.awaitQuery(mysql, rqt, data);
    }

    /**
     *
     * @param {Connection} mysql
     * @param {{new(): Class}} Construct
     * @param rqt
     * @param {Array<any>} data
     * @returns {Promise<Class[]>}
     */
    public static async fetch<Class>(
        mysql: Connection,
        Construct: new() => Class,
        rqt?: string,
        data?: Array<any>
    ): Promise<Class[]> {

        let tableMeta: TableMeta | undefined = TableMeta.getTableMeta(Construct);
        if (typeof tableMeta === 'undefined')
            throw new Error("Object is not decorated with Table/Column");

        // construct sql request
        const columns = tableMeta.getAllColumns();
        const fields: string[] = columns.map(col => `\`${(tableMeta as any).table}\`.\`${col.column}\` as \`${col.prop}\``);
        const query: string = `SELECT ${fields.join(',')} FROM ${tableMeta.table} ${rqt || ''}`;

        // get rows
        const rows: any[] = await MySQL.awaitQuery(mysql as any, query, data);

        // construct object from rows..
        return rows.map(row => Object.assign(new Construct(), row));
    }

    public static async fetchByIds<Class>(mysql: Connection, Obj: new() => Class, ids: number[]): Promise<Class[]> {
        return await MySQL.fetch(mysql, Obj, `WHERE id IN (?)`, [ids]);
    }

    public static async fetchById<Class>(mysql: Connection, Obj: new() => Class, id: number): Promise<Class> {
        return (await MySQL.fetchByIds(mysql, Obj, [id]))[0];
    }

    /**
     *
     * @param {Connection} mysql
     * @param instance
     * @returns {Promise<void>}
     */
    public static insertEntity<Class>(mysql: Connection, instance: Class): Promise<number> {

        let tableMeta: TableMeta | undefined = TableMeta.getTableMeta(instance.constructor);
        if (typeof tableMeta === 'undefined')
            throw new Error("Object is not decorated with Table/Column");

        let entries: string[] = [];
        let fields: string[] = [];
        tableMeta.getAllColumns()
            .forEach(column => {
                if (column.primary)
                    return;

                let value: any = (<any>instance)[column.prop];
                if (typeof value === 'undefined')
                    throw new Error(`The property ${column.prop} should exist on object ${instance.constructor}`);

                entries.push(value.toString());
                fields.push(column.column);
            });

        let fieldsQuery: string = fields.map(field => `\`${field}\``).join(',');
        let questionMarks: string = fields.map(() => '?').join(',');
        let rqt: string = `INSERT INTO ${tableMeta.table} (${fieldsQuery}) VALUES (${questionMarks})`;

        return MySQL.insert(mysql, rqt, entries);
    }
}
