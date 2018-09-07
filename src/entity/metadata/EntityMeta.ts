import {ENTITY_KEY} from "../decorator/Decorator";
import {FieldMeta} from "./FieldMeta";

export class EntityMeta {

    /**
     *
     * @param target
     * @returns {EntityMeta}
     */
    public static init(target: any): EntityMeta {

        if (Reflect.hasOwnMetadata(ENTITY_KEY, target)) {
            // metadata is already present on this object
            return Reflect.getOwnMetadata(ENTITY_KEY, target);

        } else if (Reflect.hasMetadata(ENTITY_KEY, target)) {
            // metadata is present in superclass
            let meta = new EntityMeta(Reflect.getMetadata(ENTITY_KEY, target));
            Reflect.defineMetadata(ENTITY_KEY, meta, target);
            return meta;

        } else {
            // metadata is not present there or in any superclass
            let meta = new EntityMeta();
            Reflect.defineMetadata(ENTITY_KEY, meta, target);
            return meta;
        }
    }

    /**
     *
     * @param target
     * @returns {EntityMeta | undefined}
     */
    public static get(target: any): EntityMeta | undefined {
        return Reflect.getMetadata(ENTITY_KEY, target);
    }

    public readonly parent?: EntityMeta;

    /**
     *
     * @type {boolean}
     */
    public isStored: boolean = false;

    /**
     *
     * @type {boolean}
     */
    public isExportable: boolean = true;

    /**
     * Table name
     * @type {string}
     */
    public table: string;

    /**
     *
     * @type {FieldMeta[]}
     */
    public fieldsMeta: FieldMeta[] = [];

    /**
     *
     * @param {EntityMeta} parent
     */
    constructor(parent?: EntityMeta) {

        this.parent = parent;
    }

    /**
     *
     * @param {FieldMeta} field
     */
    public add(field: FieldMeta): void {

        this.fieldsMeta.push(field);
    }

    /**
     *
     * @returns {FieldMeta[]}
     */
    getAll(): FieldMeta[] {
        let fields: FieldMeta[] = [];

        // parent fieldsMeta
        if (this.parent)
            fields = fields.concat(this.parent.getAll());

        // own fieldsMeta
        fields = fields.concat(this.fieldsMeta);

        return fields;
    }

    /**
     *
     * @param {string} keyword
     */
    public aggregate(keyword: string) {

        switch (keyword) {

            case 'table':
                this.isStored = true;
                break;

            case 'private':
            case 'public':
                this.isExportable = keyword === 'public';
                break;

            default:
                let match = keyword.match(/^('|")(.+)('|")$/);
                if (match === null)
                    throw new Error(`Unsupported keyword: ${keyword}`);
                this.table = match[2];
                break;
        }
    }

    /**
     * @throws Error if invalid
     */
    public validate(): void {
        // @TODO
        // throw new Error("Incomplete data");
    }
}