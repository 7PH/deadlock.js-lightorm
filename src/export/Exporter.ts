import {ClassMeta} from "./metadata/class";
import {EXPORT_KEY} from "./decorator";

export class Exporter {

    public static export(obj: any): any {

        let metadata: any = Reflect.getMetadata(EXPORT_KEY, obj.constructor);
        if (! metadata || ! (metadata instanceof ClassMeta))
            throw new Error("Unable to export non-decorated object");

        if (! metadata.hasClassDecorator)
            throw new Error("The class decorator is missing on " + obj.constructor);

        let data: any = {};

        let fields = metadata.getAllFields();
        for (let propertyMeta of fields) {

            let field: string = propertyMeta.prop;

            if (! obj.hasOwnProperty(field))
                throw new Error("Field " + field + " is not on object");

            // here is should be possible to use custom types for custom serialization
            data[field] = propertyMeta.export(obj[field]);
        }

        return data;
    }

    /**
     *
     * @param Obj
     * @param data
     */
    public static import<T>(Obj: new () => T, data: any): T {

        let rawObject: Object = typeof data === 'string' ? JSON.parse(data) : data;

        let metadata: ClassMeta | undefined = ClassMeta.getClassMeta(Obj);

        if (! metadata || ! metadata.hasClassDecorator)
            throw new Error("The class decorator is missing on " + Obj);

        let importedValues: any = {};
        let fields = metadata.getAllFields();
        for (let propertyMeta of fields) {

            let field: string = propertyMeta.prop;

            if (! rawObject.hasOwnProperty(field))
                throw new Error("Importing from object which does not have all the required properties (" + field + ")");

            importedValues[field] = propertyMeta.import((rawObject as any)[field]);
        }

        return Object.assign(new Obj(), importedValues);
    }

    public static replacer(key: string, value: any) {

        if (typeof value !== 'object')
            return value;

        let meta = ClassMeta.getClassMeta(value.constructor);
        if (typeof meta !== 'undefined')
            return Exporter.export(value);

        return value;
    }
}