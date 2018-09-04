import {Column, LIGHTORM_KEY, Table} from "../src/lightorm/decorator";
import {CustomValue, DateValue, EXPORT_KEY, Exportable, Optional, Value} from "../src/export/decorator";
import {Exporter} from "../src/export/Exporter";


/*

LightORM:

    @Table(name?: string)
        -> associate class with table 'name'
        -> params:
            name: name of the table. default: name of the class

    @Column(data?: string | boolean | {name: string, primary: boolean})
        -> associate the property with specified column
        -> params:
            data:   if data is a string:
                        will use a NON primary column named 'data'
                    if data is a boolean:
                        will use a primary column if data is true and will used the column named like the property
                    if data is an object:
                        will use column named data.name if set else will use the property name
                        will use primary column only if data.primary

Export:

    @Exportable()
        -> tells that the class can be exported/imported
        -> this decorator MUST be set else an error will be thrown if any child is decorated

    @Value()
        -> a value which is a primitive (string, boolean, number)
            will be exported without modification

    @DateValue()
        -> export a date value. (it will be converted to a timestamp)

    @CustomValue<T1, T2>(exportFun: (value: T1) => T2, importFun: (value: T2) => T1)
        -> custom export/import functions
        -> params:
            exportFun: takes the value and export it
            importFun: takes the exported data and build back the object

    @ClassValue<T>(Obj: new() => T)
        -> export a child which is also decorated with @Exportable
        -> params:
            Obj: a constructor in order to build the instance from the data

    @Optional()
        -> specifies that this property may be undefined and that in that case no error should be thrown
            this decorator should be placed BEFORE any other @Value decorator
 */

@Table('users')
@Exportable()
class User {

    @Column(true) @Value()
    public id!: number;

    @Column() @Value()
    public email!: string;

    @Column()
    public password?: string;

    @Column('added_date')
    @DateValue()
    public addedDate!: Date;

    @Column('card', '')
    @Optional() @CustomValue<string, string>(
        card => '*'.repeat(card.length - 4) + card.substr(-4),
        data => data
    )
    public card?: string;
}

let u1 = new User();
u1.id = 12;
u1.email = 'foo@bar.fr';
u1.password = 'prout';
u1.addedDate = new Date();
u1.card = '0000 0000 0000 0000';
let u2 = new User();
u2.id = 12;
u2.email = 'foo@bar.fr';
u2.password = 'prout';
u2.addedDate = new Date();
let d = [u1, u2];

let stringified = JSON.stringify(d);
let exported = JSON.stringify(d, Exporter.replacer);
console.log(stringified);
console.log(exported);

console.log(Reflect.getMetadata(LIGHTORM_KEY, User));
console.log(Reflect.getMetadata(EXPORT_KEY, User));