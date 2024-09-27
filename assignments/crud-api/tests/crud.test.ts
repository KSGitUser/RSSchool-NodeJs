/// <reference lib="dom" />
import { describe, it, expect} from '@jest/globals';
import {startServer, closeServer} from "../src/start-server";
import {PATH_NAMES, PORT} from "../src/consts";

const baseUrl = `http://localhost:${PORT}/${PATH_NAMES.USERS}`
beforeAll((done) => startServer(done));

afterAll( (done) => closeServer(done));
describe('Test API',    () => {
    const userDataWithoutId = {
        username: 'Joh',
        age: 23,
        hobbies: ['teaching']
    };
    let createdId = { id: ''};


    it('Get users', async ()=> {
        try {
            const user = await fetch(baseUrl).then(async data => {
                return await data.json();
            })
            expect(user).toMatchObject([])
        } catch(error) {
            throw error;
        }
    });

    it('Post user', async ()=> {
        try {
            const createdUser = await fetch(baseUrl, { method: 'POST', body: JSON.stringify(userDataWithoutId)}).then(async data => {
                return await data.json();
            })
            expect(createdUser).toHaveProperty('id');
            const userForTest = { username: createdUser.username, age: createdUser.age, hobbies: createdUser.hobbies};
            expect(userDataWithoutId).toMatchObject(userForTest);
            createdId.id = createdUser.id;
        } catch(error) {
            throw error;
        }
    })

    it('Get created users', async ()=> {
        try {
            const user = await fetch(`${baseUrl}/${createdId.id}`).then(async data => {
                return await data.json();
            })
            expect(user).toMatchObject({ ...userDataWithoutId, ...createdId});
        } catch(error) {
            throw error;
        }
    });

    it('Put user new data', async ()=> {
        const userData = { ...userDataWithoutId, age: 46}
        try {
            const user = await fetch(`${baseUrl}/${createdId.id}`,
                { method: 'PUT', body: JSON.stringify(userData)})
                .then(async data => {
                return await data.json();
            })
            expect(user).toMatchObject({ ...userData, ...createdId});
        } catch(error) {
            throw error;
        }
    });

    it('Delete user', async ()=> {
        try {
            let responseStatus;
            const responseData = await fetch(`${baseUrl}/${createdId.id}`,
                { method: 'DELETE'})
                .then(async data => {
                    responseStatus = data.status;
                    return await data.text();
                })
            expect(responseStatus).toEqual(204)
            expect(responseData).toEqual("");
        } catch(error) {
            throw error;
        }
    });

    it('Get deleted user', async ()=> {
        try {
            const responseData = await fetch(`${baseUrl}/${createdId.id}`).then(async data => {
                return await data.json();
            })
            expect(responseData).toHaveProperty('code');
            expect(responseData).toHaveProperty('message');
            expect(responseData.code).toEqual(404);
            expect(responseData.message).toEqual('Not Found - Record not exist');
        } catch(error) {
            throw error;
        }
    });
});
