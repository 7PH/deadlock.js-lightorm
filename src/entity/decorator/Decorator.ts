import "reflect-metadata";
import {EntityMeta} from "../metadata/EntityMeta";
import {FieldMeta} from "../metadata/FieldMeta";


class Decorator {

    /**
     * Metadata key
     * @type {string}
     */
    public static ENTITY_KEY: string = 'entity:meta';

    /**
     *
     * @param {string} keywords
     * @returns {(constructor: any) => void}
     * @constructor
     */
    public static Entity(keywords?: string) {
        return function decorator(constructor: any): void {

            const entityMeta = EntityMeta.init(constructor);
            if (typeof keywords === "string")
                keywords.split(" ").forEach(keyword =>
                    entityMeta.aggregate(keyword));

            entityMeta.validate();
        }
    }

    /**
     *
     * @param {string} description
     * @returns {(instance: any, prop: string) => void}
     * @constructor
     */
    public static Field(description: string) {
        return function decorator(instance: any, prop: string): void {

            const entityMeta = EntityMeta.init(instance.constructor);
            const fieldMeta = new FieldMeta(instance.constructor, prop, description.split(" "));
            entityMeta.add(fieldMeta);
        }
    }

}

export const ENTITY_KEY = Decorator.ENTITY_KEY;
export const Entity = Decorator.Entity;
export const Field = Decorator.Field;