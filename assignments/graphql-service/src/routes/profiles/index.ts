import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { isUUID } from '../../utils/test-uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    try {
      return await fastify.db.profiles.findMany();
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
    async function (request, reply): Promise<ProfileEntity | unknown> {
      if (isUUID(request.params.id)) {
        const fountUser = await fastify.db.profiles.findOne({
          key: 'id',
          equals: request.params.id,
        });
        if (fountUser) {
          return fountUser;
        }
        reply.code(404);
        throw new Error('No user');
      }
      reply.code(404);
      throw new Error('Wrong uuid');
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const isExistUser = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: request.body.userId,
      });
      if (isExistUser) {
        throw fastify.httpErrors.badRequest('Profile for user exist');
      }
      const createdProfile = await fastify.db.profiles.create(request.body);
      if (
        createdProfile &&
        createdProfile?.memberTypeId === request.body.memberTypeId &&
        (request.body.memberTypeId === 'basic' ||
          request.body.memberTypeId === 'business')
      ) {
        return createdProfile;
      } else {
        throw fastify.httpErrors.badRequest('No memberTypeId');
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
    async function (request, reply): Promise<ProfileEntity> {
      if (isUUID(request.params.id)) {
        return (
          (await fastify.db.profiles.delete(request.params.id)) ??
          reply.notFound()
        );
      }
      throw fastify.httpErrors.badRequest('No memberTypeId');
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | undefined> {
      if (isUUID(request.params.id)) {
        try {
          const result = await fastify.db.profiles.change(request.params.id, {
            ...request.body,
          });
          return result;
        } catch (e) {
          throw fastify.httpErrors.notFound('No profile');
        }
      }
      throw fastify.httpErrors.badRequest('No valid uuid');
    }
  );
};

export default plugin;
