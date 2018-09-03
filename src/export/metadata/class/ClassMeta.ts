import {PropertyMeta} from "../property";
import {EXPORT_KEY} from "../../decorator";

export class ClassMeta {

    /**
     *
     * @param target
     * @returns {ClassMeta}
     */
    public static initClassMeta(target: any): ClassMeta {

        if (Reflect.hasOwnMetadata(EXPORT_KEY, target)) {
            // metadata is already present on this object
            return Reflect.getOwnMetadata(EXPORT_KEY, target);

        } else if (Reflect.hasMetadata(EXPORT_KEY, target)) {
            // metadata is present in superclass
            let meta = new ClassMeta(Reflect.getMetadata(EXPORT_KEY, target));
            Reflect.defineMetadata(EXPORT_KEY, meta, target);
            return meta;

        } else {
            // metadata is not present there or in any superclass
            let meta = new ClassMeta();
            Reflect.defineMetadata(EXPORT_KEY, meta, target);
            return meta;
        }
    }

    public hasClassDecorator: boolean = false;

    public fields: PropertyMeta<any, any>[] = [];

    constructor(public readonly parent?: ClassMeta) { }

    getAllFields(): PropertyMeta<any, any>[] {
        let fields: PropertyMeta<any, any>[] = [];

        // parent fields
        if (this.parent)
            fields = fields.concat(this.parent.getAllFields());

        // own fields
        fields = fields.concat(this.fields);

        return fields;
    }
}

