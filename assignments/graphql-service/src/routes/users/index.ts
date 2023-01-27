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
    return fastify.db.users.findMany();
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
        return (
          fastify.db.users.findOne({
            key: 'id',
            equals: request.params.id,
          }) ?? reply.notFound()
        );
      }
      reply.badRequest();
      return null;
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
      return fastify.db.users.create(request.body);
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
        return fastify.db.users.delete(request.params.id) ?? reply.notFound();
      }
      reply.badRequest();
      return null;
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
      if (isUUID(request.params.id)) {
        const foundUser = await fastify.db.users.findOne({
          key: 'id',
          equals: request.params.id,
        });
        if (foundUser) {
          foundUser.subscribedToUserIds.push(request.body.userId);
          return foundUser;
        } else {
          reply.notFound();
          return null;
        }
      }
      reply.badRequest();
      return null;
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
      if (isUUID(request.params.id)) {
        const foundUser = await fastify.db.users.findOne({
          key: 'id',
          equals: request.params.id,
        });
        if (foundUser) {
          foundUser.subscribedToUserIds.find((userId, index) => {
            if (request.body.userId === userId) {
              foundUser.subscribedToUserIds.splice(index, 1);
            }
          });
          return foundUser;
        } else {
          reply.notFound();
          return null;
        }
      }
      reply.badRequest();
      return null;
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
          return fastify.db.users.change(request.params.id, request.body);
        } catch (e) {
          reply.notFound(`No post with ${request.params.id}`);
        }
      }
      reply.badRequest();
    }
  );
};

export default plugin;
