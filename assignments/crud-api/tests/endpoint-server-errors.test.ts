/// <reference lib="dom" />
import { describe, it, expect} from '@jest/globals';
import {startServer, closeServer} from "../src/start-server";
import {PATH_NAMES, PORT} from "../src/consts";

const wrongBaseURL = `http://localhost:${PORT}/api/user`
const baseUrl = `http://localhost:${PORT}/${PATH_NAMES.USERS}`
beforeAll((done) => startServer(done));
afterAll( (done) => closeServer(done));
describe('Test endpoint and server errors',    () => {
    const wrongUserDataWithoutId = '{"username":"Joh",,"age":23,"hobbies":["teaching"]}';


    it('Wrong endpoint', async ()=> {
        try {
            const getUserResponseData = await fetch(`${wrongBaseURL}`).then(async data => {
                return await data.json();
            })
            expect(getUserResponseData).toHaveProperty('code');
            expect(getUserResponseData.code).toEqual(404)
        } catch(error) {
            throw error;
        }
    });

    it('Server error - 500', async ()=> {
        try {
            const postUserResponseData = await fetch(baseUrl, { method: 'POST', body: wrongUserDataWithoutId}).then(async data => {
                return await data.json();
            })
            expect(postUserResponseData).toHaveProperty('code');
            expect(postUserResponseData.code).toEqual(500)
        } catch(error) {
            throw error;
        }
    })
});
