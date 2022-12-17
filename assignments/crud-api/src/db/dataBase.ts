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

export const memDb = new Map();

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

const readAll = () => {
    return Array.from(memDb.values())
}

const getSize = () => {
    return memDb.size;
}

export default {
    createItem,
    deleteItem,
    readItem,
    getSize,
    readAll
}
