import {Entity, Exporter, Field, MySQL} from "../src/entity";


@Entity("table 'users'")
export class User {

    @Field("primary column")
    public id!: number;

    @Field("column")
    public email!: string;

    @Field("private optional column")
    public password?: string;

    @Field("date column 'added_date'")
    public addedDate!: Date;

    @Field("private optional column")
    public card?: string;
}
