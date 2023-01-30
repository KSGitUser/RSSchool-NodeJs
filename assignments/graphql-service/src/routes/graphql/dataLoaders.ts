import * as DataLoader from 'dataloader';
import { fetchManyUsersByIds } from '../Handlers/users-handlers';
import { FastifyInstance } from 'fastify';
import { UserEntity } from '../../utils/DB/entities/DBUsers';
import { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { PostEntity } from '../../utils/DB/entities/DBPosts';
import { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const getResponseInKeyOrder = <T extends { id: string }>(
  response: T[],
  keys: readonly string[]
): T[] => {
  const dataObj: { [key: string]: T } = {};
  for (let data of response) {
    dataObj[data.id as string] = data;
  }
  return keys.map((key) => dataObj[key]);
};

export const usersLoader = (fastify: FastifyInstance) =>
  new DataLoader(async (keys: readonly string[]) => {
    const users = await fetchManyUsersByIds(fastify, { ids: keys });
    return getResponseInKeyOrder<UserEntity>(users, keys);
  });

export const profilesLoader = (fastify: FastifyInstance) =>
  new DataLoader(async (keys: readonly string[]) => {
    const profiles = await fastify.db.profiles.findMany({
      key: 'id',
      equalsAnyOf: keys as string[],
    });
    return getResponseInKeyOrder<ProfileEntity>(profiles, keys);
  });

export const postsLoader = (fastify: FastifyInstance) =>
  new DataLoader(async (keys: readonly string[]) => {
    const posts = await fastify.db.posts.findMany({
      key: 'id',
      equalsAnyOf: keys as string[],
    });
    return getResponseInKeyOrder<PostEntity>(posts, keys);
  });

export const memberTypesLoader = (fastify: FastifyInstance) =>
  new DataLoader(async (keys: readonly string[]) => {
    const memberTypes = await fastify.db.memberTypes.findMany({
      key: 'id',
      equalsAnyOf: keys as string[],
    });
    return getResponseInKeyOrder<MemberTypeEntity>(memberTypes, keys);
  });
