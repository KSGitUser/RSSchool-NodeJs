import { v4 as uuidv4, validate, version } from 'uuid';

export interface IUser {
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
    constructor(userData:IUser | Omit<IUser, "id">) {
        Reflect.ownKeys(this).forEach((key) => {
            if (key === 'id') {
                return;
            }
            if (!(key in userData)) {
                throw new Error(`No required field '${key as string}'`)
            }
        })
        this.id = (userData as IUser).id && validate((userData as IUser).id) && version((userData as IUser).id) === 4
            ? (userData as IUser).id
            : uuidv4();
        this.username = userData.username;
        this.age = userData.age;
        this.hobbies = userData.hobbies;
    }
}

