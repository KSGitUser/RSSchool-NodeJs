import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { isUUID } from '../../utils/test-uuid';
import fastifySensible from '@fastify/sensible';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.register(fastifySensible);
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    try {
      return await fastify.db.users.findMany();
    } catch (e) {
      throw fastify.httpErrors.badRequest('No memberTypeId');
    }
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null> {
      if (isUUID(request.params.id)) {
        const foundUser = await fastify.db.users.findOne({
          key: 'id',
          equals: request.params.id,
        });
        if (foundUser) {
          return foundUser;
        }
        throw fastify.httpErrors.notFound('No user');
      }
      throw fastify.httpErrors.notFound('Wrong uuid');
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        return await fastify.db.users.create(request.body);
      } catch (e) {
        throw fastify.httpErrors.badRequest('Error on post user');
      }
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null> {
      if (isUUID(request.params.id)) {
        try {
          const deletedUser = await fastify.db.users.delete(request.params.id);
          const foundUsers = await fastify.db.users.findMany({
            key: 'subscribedToUserIds',
            inArray: request.params.id,
          });
          const foundedIndexes = new Map();
          foundUsers.forEach((user) => {
            const foundIndex = user.subscribedToUserIds.indexOf(
              request.params.id
            );
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
            equals: request.params.id,
          });
          if (foundedProfile) {
            await fastify.db.profiles.delete(foundedProfile.id);
          }
          const foundedPosts = await fastify.db.posts.findMany({
            key: 'userId',
            equals: request.params.id,
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
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null> {
      if (isUUID(request.body.userId) && isUUID(request.params.id)) {
        const foundUser = await fastify.db.users.findOne({
          key: 'id',
          equals: request.body.userId,
        });
        if (foundUser) {
          const changedUser = await fastify.db.users.change(
            request.body.userId,
            {
              subscribedToUserIds: [
                ...foundUser.subscribedToUserIds,
                request.params.id,
              ],
            }
          );
          return changedUser;
        } else {
          throw fastify.httpErrors.notFound('Not found user');
        }
      }
      throw fastify.httpErrors.notFound('Wrong uuid');
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | null> {
      if (isUUID(request.params.id) && isUUID(request.body.userId)) {
        const foundUser = await fastify.db.users.findOne({
          key: 'id',
          equals: request.body.userId,
        });
        if (foundUser) {
          const foundIndex = foundUser.subscribedToUserIds.indexOf(
            request.params.id
          );
          if (foundIndex === -1) {
            throw fastify.httpErrors.badRequest('No user with subscription');
          }
          const changedUser = await fastify.db.users.change(
            request.body.userId,
            {
              subscribedToUserIds: [
                ...foundUser.subscribedToUserIds.splice(0, foundIndex),
                ...foundUser.subscribedToUserIds.splice(foundIndex + 1),
              ],
            }
          );
          return changedUser;
        } else {
          throw fastify.httpErrors.notFound('Wrong uuid');
        }
      }
      throw fastify.httpErrors.notFound('Wrong uuid');
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | undefined> {
      if (isUUID(request.params.id)) {
        try {
          return await fastify.db.users.change(request.params.id, request.body);
        } catch (e) {
          throw fastify.httpErrors.badRequest('Error on user patch');
        }
      }
      throw fastify.httpErrors.badRequest('Wrong uuid');
    }
  );
};

export default plugin;
