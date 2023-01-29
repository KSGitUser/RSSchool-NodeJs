import { FastifyInstance } from 'fastify';
import {
  ChangeUserDTO,
  CreateUserDTO,
  UserEntity,
} from '../../utils/DB/entities/DBUsers';
import { isUUID } from '../../utils/test-uuid';

export const fetchAllUsersHandler = async (
  fastify: FastifyInstance
): Promise<UserEntity[]> => {
  try {
    return await fastify.db.users.findMany();
  } catch (e) {
    throw fastify.httpErrors.badRequest('No memberTypeId');
  }
};

export const fetchUserByIdHandler = async (
  fastify: FastifyInstance,
  { id }: { id: string }
): Promise<UserEntity> => {
  if (isUUID(id)) {
    const foundUser = await fastify.db.users.findOne({
      key: 'id',
      equals: id,
    });
    if (foundUser) {
      return foundUser;
    }
    throw fastify.httpErrors.notFound('No user');
  }
  throw fastify.httpErrors.notFound('Wrong user uuid');
};

export const postUserHandler = async (
  fastify: FastifyInstance,
  args: CreateUserDTO
): Promise<UserEntity> => {
  try {
    const createdUser = await fastify.db.users.create(args as CreateUserDTO);
    return createdUser;
  } catch (e) {
    throw fastify.httpErrors.badRequest('Error on post user');
  }
};

export const deleteUserHandler = async (
  fastify: FastifyInstance,
  { id }: { id: string }
): Promise<UserEntity> => {
  if (isUUID(id)) {
    try {
      const deletedUser = await fastify.db.users.delete(id);
      const foundUsers = await fastify.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: id,
      });
      const foundedIndexes = new Map();
      foundUsers.forEach((user) => {
        const foundIndex = user.subscribedToUserIds.indexOf(id);
        if (foundIndex !== -1) {
          foundedIndexes.set(user.id, [
            ...user.subscribedToUserIds.splice(0, foundIndex),
            ...user.subscribedToUserIds.splice(foundIndex + 1),
          ]);
        }
      });
      const foundedPromises: any = [];
      Array.from(foundedIndexes.keys()).forEach((userId) => {
        foundedPromises.push([
          ...foundedPromises,
          fastify.db.users.change(userId, {
            subscribedToUserIds: foundedIndexes.get(userId),
          }),
        ]);
      });
      await Promise.all(foundedPromises);
      const foundedProfile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: id,
      });
      if (foundedProfile) {
        await fastify.db.profiles.delete(foundedProfile.id);
      }
      const foundedPosts = await fastify.db.posts.findMany({
        key: 'userId',
        equals: id,
      });
      if (foundedPosts.length) {
        const removePostsPromises: any = [];
        foundedPosts.forEach((post) => {
          removePostsPromises.push([
            ...removePostsPromises,
            fastify.db.posts.delete(post.id),
          ]);
        });
        await Promise.all(removePostsPromises);
      }
      return deletedUser;
    } catch (e) {
      throw fastify.httpErrors.badRequest('Error on post user');
    }
  }
  throw fastify.httpErrors.badRequest('Wrong delete UUID');
};

export const userSubscribeToHandler = async (
  fastify: FastifyInstance,
  args: { id: string; userId: string }
): Promise<UserEntity> => {
  const { userId, id } = args; // request.body.userId, request.params.id
  if (isUUID(userId) && isUUID(id)) {
    const foundUser = await fastify.db.users.findOne({
      key: 'id',
      equals: userId,
    });
    if (foundUser) {
      const changedUser = await fastify.db.users.change(userId, {
        subscribedToUserIds: [...foundUser.subscribedToUserIds, id],
      });
      return changedUser;
    } else {
      throw fastify.httpErrors.notFound('Not found user');
    }
  }
  throw fastify.httpErrors.notFound('Wrong uuid');
};

export const unsubscribeUserFromHandler = async (
  fastify: FastifyInstance,
  args: { id: string; userId: string }
) => {
  const { id, userId } = args; // request.params.id, request.body.userId
  if (isUUID(id) && isUUID(userId)) {
    const foundUser = await fastify.db.users.findOne({
      key: 'id',
      equals: userId,
    });
    if (foundUser) {
      const foundIndex = foundUser.subscribedToUserIds.indexOf(id);
      if (foundIndex === -1) {
        throw fastify.httpErrors.badRequest('No user with subscription');
      }
      const changedUser = await fastify.db.users.change(userId, {
        subscribedToUserIds: [
          ...foundUser.subscribedToUserIds.splice(0, foundIndex),
          ...foundUser.subscribedToUserIds.splice(foundIndex + 1),
        ],
      });
      return changedUser;
    } else {
      throw fastify.httpErrors.notFound('Wrong uuid');
    }
  }
  throw fastify.httpErrors.notFound('Wrong uuid');
};

export const changeUserHandler = async (
  fastify: FastifyInstance,
  args: { id: string; fieldsToChange: ChangeUserDTO }
) => {
  const { id, fieldsToChange } = args;
  if (isUUID(id)) {
    try {
      return await fastify.db.users.change(id, fieldsToChange);
    } catch (e) {
      throw fastify.httpErrors.badRequest('Error on user patch');
    }
  }
  throw fastify.httpErrors.badRequest('Wrong uuid');
};
