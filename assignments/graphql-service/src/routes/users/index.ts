import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import fastifySensible from '@fastify/sensible';
import {
  changeUserHandler,
  deleteUserHandler,
  fetchAllUsersHandler,
  fetchUserByIdHandler,
  postUserHandler,
  unsubscribeUserFromHandler,
  userSubscribeToHandler,
} from '../Handlers/users-handlers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.register(fastifySensible);
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fetchAllUsersHandler(fastify);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return fetchUserByIdHandler(fastify, { id: request.params.id });
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
      return await postUserHandler(fastify, request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return deleteUserHandler(fastify, { id: request.params.id });
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
    async function (request, reply): Promise<UserEntity> {
      return userSubscribeToHandler(fastify, {
        userId: request.body.userId,
        id: request.params.id,
      });
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
    async function (request, reply): Promise<UserEntity> {
      return unsubscribeUserFromHandler(fastify, {
        id: request.params.id,
        userId: request.body.userId,
      });
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
    async function (request, reply): Promise<UserEntity> {
      return changeUserHandler(fastify, {
        id: request.params.id,
        fieldsToChange: request.body,
      });
    }
  );
};

export default plugin;
