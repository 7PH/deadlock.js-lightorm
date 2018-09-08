import {EntityMeta} from "../metadata/EntityMeta";
import {ENTITY_KEY} from "../decorator/Decorator";

export class Exporter {

    public static export(obj: any): any {

        let metadata: any = Reflect.getMetadata(ENTITY_KEY, obj.constructor);
        if (! metadata || ! (metadata instanceof EntityMeta))
            throw new Error("Unable to export non-decorated object");

        if (! metadata.isExportable)
            throw new Error("The class decorator is missing on " + obj.constructor);

        let data: any = {};

        let fieldMetas = metadata.getAll();
        for (let fieldMeta of fieldMetas) {

            if (! fieldMeta.isExportable)
                continue;

            if (! obj.hasOwnProperty(fieldMeta.property))
                if (fieldMeta.optional)
                    continue;
                else
                    throw new Error("Field " + fieldMeta.property + " is not on object");

            // here is should be possible to use custom types for custom serialization
            data[fieldMeta.property] = fieldMeta.export(obj[fieldMeta.property]);
        }

        return data;
    }

    /**
     *
     * @param Obj
     * @param data
     */
    public static import<U>(Obj: new () => U, data: any): U {

        let rawObject: Object = typeof data === 'string' ? JSON.parse(data) : data;

        let metadata: EntityMeta | undefined = EntityMeta.get(Obj);

        if (! metadata || ! metadata.isExportable)
            throw new Error("The class decorator is missing on " + Obj);

        let importedValues: any = {};
        let fields = metadata.getAll();
        for (let propertyMeta of fields) {

            let field: string = propertyMeta.property;

            if (! rawObject.hasOwnProperty(field))
                if (propertyMeta.optional)
                    continue;
                else
                    throw new Error("Importing from object which does not have all the required properties (" + field + ")");

            importedValues[field] = propertyMeta.import((rawObject as any)[field]);
        }

        return Object.assign(new Obj(), importedValues);
    }

    public static replacer(key: string, value: any) {

        if (typeof value !== 'object' || value === null)
            return value;

        let meta = EntityMeta.get(value.constructor);
        if (typeof meta !== 'undefined')
            return Exporter.export(value);

        return value;
    }
}