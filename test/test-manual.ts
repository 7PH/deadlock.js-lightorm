import {exportable, Exportable, importable, Importable} from "../src";

@Importable("users")
class User extends Exportable {

    @exportable()
    @importable({primary: true})
    public id: number;

    @exportable()
    @importable('email')
    public email: string;

    @importable('password')
    public password?: string;

    @importable('date_inscription')
    public dateInscription?: number;
}

console.log("class", User);

let user1: User = new User();
user1.id = 12;
user1.email = 'foo@bar.yea';
user1.password = 'olelo';
user1.dateInscription = Date.now() / 1000;

console.log('user1', user1);
// User { id: 12, email: 'foo@bar.yea', password: 'olelo' }
console.log('user1 exported', user1.export());
// { id: 12, email: 'foo@bar.yea' }

let user2: User = new User(user1.export());

console.log('user2 imported from user1', user2);
// User { id: 12, email: 'foo@bar.yea' }
console.log('user2 exported', user2.export());
// { id: 12, email: 'foo@bar.yea' }
