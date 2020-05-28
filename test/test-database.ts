import * as mysql from "mysql"
import {Exporter, MySQL} from "../src/entity";
import {User} from "./model";


describe('Exporter', function() {

    beforeEach(function(done) {

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

        const connection = mysql.createConnection({
            host: 'mysql',
            database: 'testdb',
            port: 3306,
            user: 'mysql',
            password: 'mysql'
        });
        connection.connect((err => {
            if (err) {
                done(err);
                return;
            }
            this.connection = connection;
            done();
        }));
    });

    afterEach(function(done) {
        if (this.connection) {
            this.connection.end(done);
        }
    });

    describe('insertEntity', function() {
        it('should do what I say', async function() {
            const entry: number = await MySQL.insertEntity(this.connection, this.user1);
            console.log(entry);
        });
    });
});

// MySQL.deleteEntity(null as any, user1);
// MySQL.fetch(null, User);
// MySQL.insertEntity(null as any, user2);
// MySQL.syncEntity(null as any, user1);
