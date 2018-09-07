import {Entity, Field} from "../src/entity/decorator/Decorator";
import {Exporter} from "../src/entity/exporter/Exporter";


@Entity("table 'users'")
class User {

    @Field("primary column")
    public id!: number;

    @Field("column")
    public email!: string;

    @Field("private optional column")
    public password?: string;

    @Field("date column 'added_date'")
    public addedDate!: Date;

    @Field(
        "optional column",
        // card => '*'.repeat(card.length - 4) + card.substr(-4),
        // data => data
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
console.log(Exporter.import(User, JSON.parse(exported)[0]));