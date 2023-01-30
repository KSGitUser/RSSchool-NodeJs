import * as DataLoader from 'dataloader';
import { fetchManyUsersByIds } from '../Handlers/users-handlers';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../utils/DB/entities/DBUsers';

export const usersLoader = (fastify: FastifyInstance) =>
  new DataLoader(async (keys: readonly string[]) => {
    const users = await fetchManyUsersByIds(fastify, { ids: keys });
    const usersObj: { [key: string]: UserEntity } = {};
    for (let user of users) {
      usersObj[user.id] = user;
    }
    return keys.map((key) => usersObj[key]);
  });
