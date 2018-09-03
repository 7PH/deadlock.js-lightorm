import "reflect-metadata";
import {ClassMeta} from "../metadata/class/ClassMeta";
import {DatePropertyMeta} from "../metadata/property/DatePropertyMeta";
import {CustomPropertyMeta} from "../metadata/property/CustomPropertyMeta";
import {ClassPropertyMeta} from "../metadata/property/ClassPropertyMeta";
import {PrimitivePropertyMeta} from "../metadata/property/PrimitivePropertyMeta";
import {ArrayPropertyMeta} from "../metadata/property/ArrayPropertyMeta";


export class Serialy {

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

export const KEY = Serialy.KEY;
export const Serializable = Serialy.Serializable;
export const ClassValue = Serialy.ClassValue;
export const ArrayValue = Serialy.ArrayValue;
export const Value = Serialy.Value;
export const DateValue = Serialy.DateValue;
export const CustomValue = Serialy.CustomValue;
