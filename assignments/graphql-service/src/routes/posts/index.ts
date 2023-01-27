import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { isUUID } from '../../utils/test-uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | null> {
      if (isUUID(request.params.id)) {
        return (
          fastify.db.posts.findOne({ key: 'id', equals: request.params.id }) ??
          reply.notFound()
        );
      }
      throw fastify.httpErrors.badRequest('Non valid uuid');
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      return fastify.db.posts.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | null> {
      if (isUUID(request.params.id)) {
        return fastify.db.posts.delete(request.params.id) ?? reply.notFound();
      }
      reply.badRequest();
      return null;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity | undefined> {
      if (isUUID(request.params.id)) {
        try {
          return fastify.db.posts.change(request.params.id, request.body);
        } catch (e) {
          reply.notFound(`No post with ${request.params.id}`);
        }
      }
      reply.badRequest();
    }
  );
};

export default plugin;
