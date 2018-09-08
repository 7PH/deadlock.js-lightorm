import {Entity, Exporter, Field} from "../src/entity";


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

    @Field("private optional column")
    public card?: string;
}

describe('Exporter', function() {

    beforeEach(function() {

        let user1 = new User();
        user1.id = 12;
        user1.email = 'foo@bar.fr';
        user1.password = 'prout';
        user1.addedDate = new Date();
        user1.card = '0000 0000 0000 0000';

        let user2 = new User();
        user2.id = 12;
        user2.email = 'foo@bar.fr';
        user2.password = 'prout';
        user2.addedDate = new Date();

        this.user1 = user1;
        this.user2 = user2;
        this.userList = [user1, user2];
    });

    describe('export', function() {

        beforeEach(function() {
            this.exported = Exporter.export(this.user1);
        });

        describe('public/private', function() {

            it('should not export private properties', function(done) {
                if ("password" in this.exported || "card" in this.exported)
                    throw new Error("Private field should not be exported");
                done();
            });

            it('should export public properties', function(done) {
                ['id', 'email', 'addedDate'].forEach(
                    field => {
                        if (! (field in this.exported))
                            throw new Error("Field " + field + " was expected");
                    }
                );
                done();
            });
        });

        describe('date', function() {

            it('should export date as timestamps', function(done) {
                if (! ("addedDate" in this.exported))
                    throw new Error("Date should be present in exported object");
                if (typeof this.exported['addedDate'] !== "number")
                    throw new Error("Date should be exported as number");
                done();
            });
        });

        describe('recursion', function() {
            // @TODO
        });

        describe('array', function() {
            // @TODO
        });

        describe('custom', function() {
            // @TODO
        });
    });

    describe('import', function() {

        beforeEach(function() {
            this.exported = Exporter.export(this.user1);
            this.imported = Exporter.import(User, this.exported);
        });

        it('should be an instance of the given class', function(done) {
            if (! (this.imported instanceof User))
                throw new Error("Imported data should be an instance of the constructor");
            done();
        });
    });
});

/*

let stringified = JSON.stringify(d);
let exported = JSON.stringify(d, Exporter.replacer);
console.log(stringified);
console.log(exported);
console.log(Exporter.import(User, JSON.parse(exported)[0]));

// MySQL.fetch(null, User);
// MySQL.insertEntity(null as any, u2);
*/