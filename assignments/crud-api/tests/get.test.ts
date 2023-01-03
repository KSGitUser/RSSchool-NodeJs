/// <reference lib="dom" />
import { describe, it, before, after} from "node:test";
import * as assert from "assert";
import {startServer, closeServer} from "../src/start-server.js";

describe('Test API',  async () => {
    before(() => startServer());

     it('Get users', async ()=> {
        try {
            const user = await fetch('http://localhost:3000/api/users').then(async data => {
                return await data.json();
            })
            assert.deepStrictEqual(user, []);
        } catch(error) {
            throw error;
        }
    });

    it('Post user', async ()=> {
        const mockedUser = {
            username: 'Joh',
            age: 23,
            hobbies: ['teaching']
        }

        try {
            const createdUser = await fetch('http://localhost:3000/api/users', { method: 'POST', body: JSON.stringify(mockedUser)}).then(async data => {
                return await data.json();
            })
            assert.ok(createdUser.hasOwnProperty('id'));
            const userForTest = { username: createdUser.username, age: createdUser.age, hobbies: createdUser.hobbies};
            assert.deepStrictEqual(mockedUser, userForTest);
        } catch(error) {
            throw error;
        }
    })

    after(()=>closeServer())
});
