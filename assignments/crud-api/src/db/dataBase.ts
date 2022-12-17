import type {User} from "../models/User.js";

export const memDb = new Map();

const addItem = (userData: User) => {
    memDb.set(userData.id, userData);
}

const deleteItem = (id: User["id"]) => {
    return memDb.delete(id);
}

const getItem = (id: User["id"]) => {
    return memDb.get(id);
}

const getSize = () => {
    return memDb.size;
}

export default {
    addItem,
    deleteItem,
    getItem,
    getSize
}
