/// <reference lib="dom" />
import { describe, it, expect} from '@jest/globals';
import {startServer, closeServer} from "../src/start-server";
import {PATH_NAMES, PORT} from "../src/consts";

const baseUrl = `http://localhost:${PORT}/${PATH_NAMES.USERS}`
beforeAll((done) => startServer(done), 10000);
afterAll( (done) =>  closeServer(done));
describe('Test Errors',    () => {
    const userDataWithoutAge = {
        username: 'Joh',
        hobbies: ['teaching']
    };
    let notUUID = '98e3ebde-ad88-4b9a-b605-7caa';
    let wrongUUID = '98e3ebde-ad88-4b9a-b605-7cd49e18a5aa'


    it('POST - If request body does not contain required fields - 400', async ()=> {
        try {
            const postResponseData = await fetch(baseUrl, { method: 'POST', body: JSON.stringify(userDataWithoutAge)}).then(async data => {
                return await data.json();
            })
            expect(postResponseData).toHaveProperty('code');
            expect(postResponseData.code).toEqual(400)
        } catch(error) {
            throw error;
        }
    })

    it('GET user,  if userId is invalid (not uuid) - 400', async ()=> {
        try {
            const getUserResponseData = await fetch(`${baseUrl}/${notUUID}`).then(async data => {
                return await data.json();
            })
            expect(getUserResponseData).toHaveProperty('code');
            expect(getUserResponseData.code).toEqual(400)
        } catch(error) {
            throw error;
        }
    });


    it('GET user,  if record with id === userId doesn\'t exist - 404', async ()=> {
        try {
            const getUserResponseData = await fetch(`${baseUrl}/${wrongUUID}`).then(async data => {
                return await data.json();
            })
            expect(getUserResponseData).toHaveProperty('code');
            expect(getUserResponseData.code).toEqual(404)
        } catch(error) {
            throw error;
        }
    });

    it('PUT user,  if userId is invalid (not uuid) - 400', async ()=> {
        const userData = { ...userDataWithoutAge, age: 46}
        try {
            const putUserResponseData = await fetch(`${baseUrl}/${notUUID}`,
                { method: 'PUT', body: JSON.stringify(userData)})
                .then(async data => {
                    return await data.json();
                })
            expect(putUserResponseData).toHaveProperty('code');
            expect(putUserResponseData.code).toEqual(400)
        } catch(error) {
            throw error;
        }
    });

    it('PUT user, if record with id === userId doesn\'t exist - 404', async ()=> {
        const userData = { ...userDataWithoutAge, age: 46}
        try {
            const putUserResponseData = await fetch(`${baseUrl}/${wrongUUID}`,
                { method: 'PUT', body: JSON.stringify(userData)})
                .then(async data => {
                return await data.json();
            })
            expect(putUserResponseData).toHaveProperty('code');
            expect(putUserResponseData.code).toEqual(404)
        } catch(error) {
            throw error;
        }
    });

    it('DELETE user,  if userId is invalid (not uuid) - 400', async ()=> {
        try {
            const deleteResponseData = await fetch(`${baseUrl}/${notUUID}`,
                { method: 'DELETE'})
                .then(async data => {
                    return await data.json();
                })
            expect(deleteResponseData).toHaveProperty('code');
            expect(deleteResponseData.code).toEqual(400)
        } catch(error) {
            throw error;
        }
    });

    it('DELETE user, if record with id === userId doesn\'t exist - 404', async ()=> {
        try {
            const deleteResponseData = await fetch(`${baseUrl}/${wrongUUID}`,
                { method: 'DELETE'})
                .then(async data => {
                    return await data.json();
                })
            expect(deleteResponseData).toHaveProperty('code');
            expect(deleteResponseData.code).toEqual(404)
        } catch(error) {
            throw error;
        }
    });


});
