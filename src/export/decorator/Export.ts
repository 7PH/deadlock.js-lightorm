import "reflect-metadata";
import {ClassMeta} from "../metadata/class";
import {
    ArrayPropertyMeta,
    ClassPropertyMeta,
    CustomPropertyMeta,
    DatePropertyMeta,
    PrimitivePropertyMeta
} from "../metadata/property";


export class Export {

    public static readonly KEY: string = 'serialy:meta';

    public static Serializable() {
        return function decorator(constructor: any): void {

            const classMeta = ClassMeta.initClassMeta(constructor);
            classMeta.hasClassDecorator = true;
        }
    }

    public static ClassValue<T>(Obj: new () => T) {
        return function decorator(instance: any, prop: string): void {

            const classMeta = ClassMeta.initClassMeta(instance.constructor);
            classMeta.fields.push(new ClassPropertyMeta(prop, Obj));
        }
    }

    public static ArrayValue<T>(Obj: new () => T) {
        return function decorator(instance: any, prop: string): void {

            const classMeta = ClassMeta.initClassMeta(instance.constructor);
            classMeta.fields.push(new ArrayPropertyMeta(prop, Obj));
        }
    }

    public static Value() {
        return function decorator(instance: any, prop: string): void {

            const classMeta = ClassMeta.initClassMeta(instance.constructor);
            classMeta.fields.push(new PrimitivePropertyMeta(prop));
        }
    }

    public static DateValue() {
        return function decorator(instance: any, prop: string): void {

            const classMeta = ClassMeta.initClassMeta(instance.constructor);
            classMeta.fields.push(new DatePropertyMeta(prop));
        }
    }

    public static CustomValue<U, T>(exportFun: (value: U) => T, importFun: (value: T) => U) {
        return function decorator(instance: any, prop: string): void {

            const classMeta = ClassMeta.initClassMeta(instance.constructor);
            classMeta.fields.push(new CustomPropertyMeta<U, T>(prop, exportFun, importFun));
        }
    }

}

export const EXPORT_KEY = Export.KEY;
export const Serializable = Export.Serializable;
export const ClassValue = Export.ClassValue;
export const ArrayValue = Export.ArrayValue;
export const Value = Export.Value;
export const DateValue = Export.DateValue;
export const CustomValue = Export.CustomValue;
