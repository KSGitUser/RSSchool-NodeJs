import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { isUUID } from '../../utils/test-uuid';
import { fetchAllPosts } from '../Handlers/posts-handlers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fetchAllPosts(fastify);
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      if (isUUID(request.params.id)) {
        const foundedPost = await fastify.db.posts.findOne({
          key: 'id',
          equals: request.params.id,
        });
        if (!foundedPost) {
          throw fastify.httpErrors.notFound('No post');
        }
        return foundedPost;
      }
      throw fastify.httpErrors.notFound('Wrong post uuid in get');
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
      try {
        return await fastify.db.posts.create(request.body);
      } catch (e) {
        throw fastify.httpErrors.badRequest('Bad request on post posts');
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
    async function (request, reply): Promise<PostEntity | null> {
      if (isUUID(request.params.id)) {
        try {
          return await fastify.db.posts.delete(request.params.id);
        } catch (e) {
          throw fastify.httpErrors.badRequest('Error on posts delete');
        }
      }
      throw fastify.httpErrors.badRequest('Wrong UUID on posts delete');
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
          return await fastify.db.posts.change(request.params.id, request.body);
        } catch (e) {
          throw fastify.httpErrors.badRequest('Error on posts patch');
        }
      }
      throw fastify.httpErrors.badRequest('Wrong UUID on posts patch');
    }
  );
};

export default plugin;
