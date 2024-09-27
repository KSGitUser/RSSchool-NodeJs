import {User} from '../models/User.js';
import type {IUser} from '../models/User.js';
import {STATUS_CODES} from 'node:http'
import {validate} from 'uuid';
import BaseError from '../errors/BaseError.js'

export const HTTP_RESPONSE_CODES = {
    WRONG_UUID: {
        code: 400,
        message: (errorMessage: string = 'No or wrong uuid') => `${STATUS_CODES[400]} - ${errorMessage}`
    },
    NOT_ALL_REQUIRED_FIELDS: {
        code: 400,
        message: (errorMessage: string = 'Not all required fields') => `${STATUS_CODES[400]} - ${errorMessage}`
    },
    NOT_EXIST: {
        code: 404,
        message: (errorMessage: string = 'Record not exist') => `${STATUS_CODES[404]} - ${errorMessage}`
    }
}

export let memDb = new Map();

const createItem = (userData: Omit<IUser, "id">) => {
    try {
        const newUser: User = new User(userData)
        memDb.set(newUser.id, newUser)
        return newUser
    } catch (error: any) {
        throw new BaseError(
            HTTP_RESPONSE_CODES.NOT_ALL_REQUIRED_FIELDS.code,
            HTTP_RESPONSE_CODES.NOT_ALL_REQUIRED_FIELDS.message(error.message)
        )
    }
}

const deleteItem = (id: User["id"]) => {
    if (!id || !validate(id)) {
        throw new BaseError(HTTP_RESPONSE_CODES.WRONG_UUID.code, HTTP_RESPONSE_CODES.WRONG_UUID.message())
    }
    if (!memDb.has(id)) {
        throw new BaseError(HTTP_RESPONSE_CODES.NOT_EXIST.code, HTTP_RESPONSE_CODES.NOT_EXIST.message())
    }
    return memDb.delete(id)
}

const readItem = (id: User["id"]) => {
    if (!id || !validate(id)) {
        throw new BaseError(HTTP_RESPONSE_CODES.WRONG_UUID.code, HTTP_RESPONSE_CODES.WRONG_UUID.message())
    }
    if (!memDb.has(id)) {
        throw new BaseError(HTTP_RESPONSE_CODES.NOT_EXIST.code, HTTP_RESPONSE_CODES.NOT_EXIST.message())
    }
    return memDb.get(id)
}

const updateItem = (userData: IUser) => {
    if (!userData || !userData.id || !validate(userData.id)) {
        throw new BaseError(HTTP_RESPONSE_CODES.WRONG_UUID.code, HTTP_RESPONSE_CODES.WRONG_UUID.message())
    }
    if (!memDb.has(userData.id)) {
        throw new BaseError(HTTP_RESPONSE_CODES.NOT_EXIST.code, HTTP_RESPONSE_CODES.NOT_EXIST.message())
    }

    try {
        const oldUser: User = memDb.get(userData.id);
        const newUser: User = new User({...oldUser, ...userData})

        memDb.set(newUser.id, newUser)
        return newUser
    } catch (error: any) {
        throw new BaseError(
            HTTP_RESPONSE_CODES.NOT_ALL_REQUIRED_FIELDS.code,
            HTTP_RESPONSE_CODES.NOT_ALL_REQUIRED_FIELDS.message(error.message)
        )
    }
}

const readAll = () => {
    return Array.from(memDb.values())
}

const getSize = () => {
    return memDb.size;
}

const getDbEntries = () => {
    return Object.fromEntries(memDb);
}

const mapFromEntries = (data:any) => {
    memDb = new Map(Object.entries(data));
}

export default {
    createItem,
    deleteItem,
    readItem,
    updateItem,
    getSize,
    readAll,
    getDbEntries,
    mapFromEntries,
}
