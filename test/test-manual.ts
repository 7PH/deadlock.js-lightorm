import {Column, KEY, Table} from "../src/lightorm/decorator/LightORM";
import {CustomValue, DateValue, Serializable, Value} from "../src/export/decorator";

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


console.log(Reflect.getMetadata(KEY, User).getAllColumns());