import {PropertyMeta} from "../property";
import {LIGHTORM_KEY} from "../../../lightorm/decorator";

export class ClassMeta {

    /**
     *
     * @param target
     * @returns {ClassMeta}
     */
    public static initClassMeta(target: any): ClassMeta {

        if (Reflect.hasOwnMetadata(LIGHTORM_KEY, target)) {
            // metadata is already present on this object
            return Reflect.getOwnMetadata(LIGHTORM_KEY, target);

        } else if (Reflect.hasMetadata(LIGHTORM_KEY, target)) {
            // metadata is present in superclass
            let meta = new ClassMeta(Reflect.getMetadata(LIGHTORM_KEY, target));
            Reflect.defineMetadata(LIGHTORM_KEY, meta, target);
            return meta;

        } else {
            // metadata is not present there or in any superclass
            let meta = new ClassMeta();
            Reflect.defineMetadata(LIGHTORM_KEY, meta, target);
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

