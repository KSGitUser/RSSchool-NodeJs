/// <reference lib="dom" />
import { describe, it, beforeAll, afterAll, expect} from '@jest/globals';
import {startServer, closeServer} from "../src/start-server";

describe('Test API',   () => {
    beforeAll(() => startServer());

     it('Get users', async ()=> {
        try {
            const user = await fetch('http://localhost:3000/api/users').then(async data => {
                return await data.json();
            })
            expect(user).toMatchObject([])
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
            expect(createdUser).toHaveProperty('id');
            const userForTest = { username: createdUser.username, age: createdUser.age, hobbies: createdUser.hobbies};
            expect(mockedUser).toMatchObject(userForTest);
        } catch(error) {
            throw error;
        }
    })

    afterAll(()=>closeServer())
});
