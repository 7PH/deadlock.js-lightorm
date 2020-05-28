import {Connection, MysqlError} from "mysql";
import {EntityMeta, FieldMeta} from "../metadata";


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

        let entityMeta: EntityMeta | undefined = EntityMeta.get(Construct);
        if (typeof entityMeta === 'undefined' || ! entityMeta.isStored)
            throw new Error("Object is not decorated properly");

        // construct sql request
        const fieldsMeta = entityMeta.getAll();
        const propFieldsMeta: {[prop: string]: FieldMeta} = {};
        const fields: string[] = [];
        for (let fieldMeta of fieldsMeta) {
            propFieldsMeta[fieldMeta.property] = fieldMeta;
            fields.push(`\`${(entityMeta as any).table}\`.\`${fieldMeta.fieldName}\` as \`${fieldMeta.property}\``);
        }
        const query: string = `SELECT ${fields.join(',')} FROM ${entityMeta.table} ${rqt || ''}`;

        // get rows
        const rows: any[] = await MySQL.awaitQuery(mysql as any, query, data);

        // construct object from rows..
        const objects: Class[] = [];
        for (const row of rows) {
            let object = new Construct();

            for (const column in row) {
                switch (propFieldsMeta[column].type) {

                    case "date":
                        (object as any)[column] = new Date(row[column]);
                        break;

                    default:
                        (object as any)[column] = row[column];
                        break;
                }
            }
            objects.push(object);
        }
        return objects;
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
    public static insertEntity<Class extends Object>(mysql: Connection, instance: Class): Promise<number> {

        let entityMeta: EntityMeta | undefined = EntityMeta.get(instance.constructor);
        if (typeof entityMeta === 'undefined' || ! entityMeta.isStored)
            throw new Error("Object is not decorated properly");

        let entries: string[] = [];
        let fields: string[] = [];
        entityMeta.getAll()
            .forEach(fieldMeta => {
                if (fieldMeta.primary)
                    return;

                let value: any = (<any>instance)[fieldMeta.property];
                if ((value === null || typeof value === "undefined") && ! fieldMeta.optional)
                    throw new Error("Trying to insert non-optional yet undefined or null value " + fieldMeta.property);

                if (value === null || typeof value === "undefined")
                    return;

                switch (fieldMeta.type) {
                    case "date":
                        entries.push(value.toISOString().slice(0, 19).replace('T', ' '));
                        break;

                    case "primitive":
                        entries.push(value.toString());
                        break;

                    default:
                        throw new Error("Unable to push " + fieldMeta.property + " in database of type " + fieldMeta.type);
                }
                fields.push(fieldMeta.fieldName);
            });

        let fieldsQuery: string = fields.map(field => `\`${field}\``).join(',');
        let questionMarks: string = fields.map(() => '?').join(',');
        let rqt: string = `INSERT INTO ${entityMeta.table} (${fieldsQuery}) VALUES (${questionMarks})`;

        return MySQL.insert(mysql, rqt, entries);
    }

    /**
     *
     * @param {Connection} mysql
     * @param instance
     * @returns {Promise<void>}
     */
    public static async syncEntity<Class extends Object>(mysql: Connection, instance: Class): Promise<void> {

        let entityMeta: EntityMeta | undefined = EntityMeta.get(instance.constructor);
        if (typeof entityMeta === 'undefined' || ! entityMeta.isStored)
            throw new Error("Object is not decorated properly");

        // For an entity to be synced, it needs to have a primary key
        let primary = entityMeta.getAll().find(fieldMeta => fieldMeta.primary);
        if (typeof primary === "undefined")
            throw new Error("Unable to find a primary key on " + instance.constructor);


        let nonPrimary = entityMeta.getAll().filter(fieldMeta => ! fieldMeta.primary);
        if (nonPrimary.length === 0) {
            return;
        }

        let entryFields = nonPrimary.map(fieldMeta => `\`${fieldMeta.fieldName}\`=?`).join(',');
        let rqt: string = `UPDATE \`${entityMeta.table}\` SET ${entryFields} WHERE \`${primary.fieldName}\`=?`;
        let entries = nonPrimary.map(fieldMeta => ((instance as any)[fieldMeta.property]));
        // Add the primary column value (where clause)
        entries.push((instance as any)[primary.property]);
        await MySQL.awaitQuery(mysql, rqt, entries);
    }

    /**
     *
     * @param {Connection} mysql
     * @param instance
     * @returns {Promise<void>}
     */
    public static async deleteEntity<Class extends Object>(mysql: Connection, instance: Class): Promise<void> {

        let entityMeta: EntityMeta | undefined = EntityMeta.get(instance.constructor);
        if (typeof entityMeta === 'undefined' || ! entityMeta.isStored)
            throw new Error("Object is not decorated properly");

        let primary = entityMeta.getAll().find(fieldMeta => fieldMeta.primary);
        if (typeof primary === "undefined")
            throw new Error("Unable to find a primary key on " + instance.constructor);

        let rqt: string = `DELETE FROM \`${entityMeta.table}\` WHERE \`${primary.fieldName}\`=?`;
        let entries: string[] = [(instance as any)[primary.property]];
        await MySQL.awaitQuery(mysql, rqt, entries);
    }
}
