import {PropertyExporter} from "../exporter/PropertyExporter";
import {ObjectExporter} from "../exporter/ObjectExporter";
import {DateExporter} from "../exporter/DateExporter";
import {ArrayExporter} from "../exporter/ArrayExporter";
import {PrimitiveExporter} from "../exporter/PrimitiveExporter";

export class FieldMeta {

    /**
     * Class
     */
    public readonly target: any;

    /**
     * Property on the object
     */
    public readonly property: string;

    /**
     *
     * @type {boolean}
     */
    public isStored: boolean = false;

    /**
     * Is the property exportable? Should it be exported?
     * @type {boolean}
     */
    public isExportable: boolean = true;

    /**
     * Field name
     */
    public fieldName: string;

    /**
     * Data type
     * @type {'primitive' | 'object' | 'array' | 'date'}
     */
    public type: 'primitive' | 'object' | 'array' | 'date' = 'primitive';

    /**
     * primary column?
     */
    public primary: boolean = false;

    /**
     * Accept undefined values?
     */
    public optional: boolean = false;

    /**
     *
     */
    private exporter: PropertyExporter;

    /**
     * @constructor
     * @param target
     * @param {string} property
     * @param keywords
     */
    constructor(target: string, property: string, keywords?: string[]) {

        this.target = target;

        this.property = property;

        if (keywords)
            for (let keyword of keywords)
                this.aggregate(keyword);

        this.exporter = this.instantiate();
    }

    /**
     *
     */
    public instantiate(): PropertyExporter {
        switch (this.type) {

            case "array":
                return new ArrayExporter(this.target);

            case "date":
                return new DateExporter();

            case "object":
                return new ObjectExporter(this.target);

            case "primitive":
                return new PrimitiveExporter();

            default:
                throw new Error(`Wrong property type for ${this.property}: ${this.type}`);
        }
    }

    /**
     *
     * @param {string} keyword
     */
    private aggregate(keyword: string) {

        switch (keyword) {

            case 'public':
            case 'private':
                this.isExportable = keyword === 'public';
                break;

            case 'column':
                this.isStored = true;
                break;

            case 'date':
                this.type = 'date';
                break;

            case 'optional':
                this.optional = true;
                break;

            case 'primary':
                this.primary = true;
                break;

            default:
                let match = keyword.match(/^('|")(.+)('|")$/);
                if (match === null)
                    throw new Error(`Unsupported keyword for '${this.property}': ${keyword}`);
                this.fieldName = match[2];
                break;
        }
    }

    /**
     *
     * @param {string} name
     */
    public export(name: string): any {
        return this.exporter.export(name);
    }

    /**
     *
     * @param {string} name
     */
    public import(name: string): any {
        return this.exporter.import(name);
    }
}