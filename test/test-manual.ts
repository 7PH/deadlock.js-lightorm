import {Column, Table} from "../src/lightorm/decorator";
import {CustomValue, DateValue, Serializable, Value} from "../src/export/decorator";
import {Exporter} from "../src/export/Exporter";

@Table('users') @Serializable()
class User {

    @Column() @Value()
    public id!: number;

    @Column() @Value()
    public email!: string;

    @Column()
    public password?: string;

    @Column('added_date') @DateValue()
    public addedDate!: Date;

    @Column('card') @CustomValue<string, string>(
        card => '*'.repeat(card.length - 4) + card.substr(-4),
        data => data
    )
    public card!: string;
}

let u = new User();
u.id = 12;
u.email = 'foo@bar.fr';
u.password = 'prout';
u.addedDate = new Date();
u.card = '0000 0000 0000 0000';
let d = [u];

let stringified = JSON.stringify(d);
let exported = JSON.stringify(d, Exporter.replacer);
console.log(stringified);
console.log(exported);