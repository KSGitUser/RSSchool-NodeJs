import { FastifyInstance } from 'fastify';
import {
  ChangeMemberTypeDTO,
  MemberTypeEntity,
} from '../../utils/DB/entities/DBMemberTypes';

export const fetchAllMemberTypesHandler = async (
  fastify: FastifyInstance
): Promise<MemberTypeEntity[]> => {
  return fastify.db.memberTypes.findMany();
};

export const fetchAMemberTypesByIdHandler = async (
  fastify: FastifyInstance,
  args: { id: string }
): Promise<MemberTypeEntity> => {
  if (args.id === 'basic' || args.id === 'business') {
    try {
      const foundedMemberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: args.id,
      });
      if (!foundedMemberType) {
        throw fastify.httpErrors.notFound('No such member types');
      }
      return foundedMemberType;
    } catch (e) {
      throw fastify.httpErrors.notFound('Error on get member types');
    }
  }
  throw fastify.httpErrors.notFound('Wrong ID');
};

export const changeAMemberTypesHandler = async (
  fastify: FastifyInstance,
  args: { id: string; body: ChangeMemberTypeDTO }
): Promise<MemberTypeEntity> => {
  if (args.id === 'basic' || args.id === 'business') {
    try {
      const changedMemberTypes = await fastify.db.memberTypes.change(
        args.id,
        args.body
      );
      if (!changedMemberTypes) {
        throw fastify.httpErrors.notFound(
          `Can not change Member Types - not found`
        );
      }
      return changedMemberTypes;
    } catch (e) {
      throw fastify.httpErrors.badRequest('Error on Member Types patch');
    }
  }
  throw fastify.httpErrors.badRequest('Wrong ID on Member Types change');
};
