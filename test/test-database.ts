import * as mysql from "mysql";
import {Exporter, MySQL} from "../src/entity";
import {User} from "./model";
import {should, expect, assert} from "chai";


describe('Exporter', function() {

    beforeEach(function(done) {

        const connection = mysql.createConnection({
            host: 'mysql',
            database: 'testdb',
            port: 3306,
            user: 'mysql',
            password: 'mysql'
        });
        this.connection = connection;
        connection.connect((err => {
            if (err) {
                done(err);
                return;
            }
            connection.query('truncate users', err => {
                if (err) {
                    done(err);
                    return;
                }
                done();
            });
        }));
    });

    afterEach(function(done) {
        if (this.connection) {
            this.connection.end(done);
        }
    });

    describe('insertEntity', function() {

        it('should be able to insert a fully an entity', async function() {

            // Prepare an entry that will be inserted in database
            const insertedEntry = new User();
            insertedEntry.email = 'foo@bar.com';
            insertedEntry.password = 'thepassword';
            insertedEntry.addedDate = new Date();
            insertedEntry.card = '0000 0001 2000 0101';

            // Insert it
            const insertedId: number = await MySQL.insertEntity(this.connection, insertedEntry);

            // Get it back
            const fetchedEntry: User = await MySQL.fetchById(this.connection, User, insertedId);

            // Check that the id has been set
            expect(fetchedEntry.id).to.equal(insertedId);

            // Check that the values have been kept
            expect(fetchedEntry.email).to.equal(insertedEntry.email);
            expect(fetchedEntry.password).to.equal(insertedEntry.password);
            expect(fetchedEntry.addedDate.toUTCString()).to.equal(insertedEntry.addedDate.toUTCString());
            expect(fetchedEntry.card).to.equal(insertedEntry.card);
        });

        it('should be able to insert an entity with missing optional fields', async function() {

            // Prepare an entry that will be inserted in database
            const insertedEntry = new User();
            insertedEntry.email = 'foo@bar.com';
            insertedEntry.password = 'thepassword';
            insertedEntry.addedDate = new Date();

            // Insert it
            const insertedId: number = await MySQL.insertEntity(this.connection, insertedEntry);

            // Get it back
            const fetchedEntry: User = await MySQL.fetchById(this.connection, User, insertedId);

            // Check that the id has been set
            expect(fetchedEntry.id).to.equal(insertedId);

            // Check that the values have been kept
            expect(fetchedEntry.email).to.equal(insertedEntry.email);
            expect(fetchedEntry.password).to.equal(insertedEntry.password);
            expect(fetchedEntry.addedDate.toUTCString()).to.equal(insertedEntry.addedDate.toUTCString());
            expect(fetchedEntry.card).to.equal(null);
        });
    });

    describe('syncEntity', function() {

        it('synchronize a previously inserted entity', async function() {

            // Prepare an entry that will be inserted in database
            const entry = new User();
            entry.email = 'foo@bar.com';
            entry.password = 'thepassword';
            entry.addedDate = new Date();
            entry.card = '0000 0000 0000 0000';

            // Insert it
            const insertedId: number = await MySQL.insertEntity(this.connection, entry);

            // Update it
            entry.card = '1111 1111 1111 1111';
            await MySQL.syncEntity(this.connection, entry);

            // Fetch it
            const fetchedEntry1 = await MySQL.fetchById(this.connection, User, insertedId);

            // Check that the card is the new one
            expect(fetchedEntry1.card).to.equal(entry.card);
        });
    });
});
