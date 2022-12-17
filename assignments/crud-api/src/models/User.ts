import { v4 as uuidv4 } from 'uuid';

interface IUser {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}

export class User implements IUser {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
    constructor(userData: Omit<IUser, "id">) {
        Reflect.ownKeys(this).forEach(key => {
            if (key === 'id') {
                return;
            }
            if (!(key in userData)) {
                throw new Error("No required field")
            }
        })
        this.id = uuidv4();
        this.username = userData.username;
        this.age = userData.age;
        this.hobbies = userData.hobbies;
    }
}

