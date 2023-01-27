import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | null> {
      if (request.params.id === 'basic' || request.params.id === 'business') {
        try {
          return await fastify.db.memberTypes.findOne({
            key: 'id',
            equals: request.params.id,
          });
        } catch (e) {
          throw fastify.httpErrors.notFound('Error on get member types');
        }
      }
      throw fastify.httpErrors.notFound('Wrong ID');
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity | undefined> {
      if (request.params.id === 'basic' || request.params.id === 'business') {
        try {
          return await fastify.db.memberTypes.change(
            request.params.id,
            request.body
          );
        } catch (e) {
          throw fastify.httpErrors.badRequest('Error on Member Type patch');
        }
      }
      throw fastify.httpErrors.badRequest('Wrong ID');
    }
  );
};

export default plugin;
