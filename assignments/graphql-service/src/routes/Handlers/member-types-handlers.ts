import { FastifyInstance } from 'fastify';
import {
  ChangeMemberTypeDTO,
  MemberTypeEntity,
} from '../../utils/DB/entities/DBMemberTypes';
import { isUUID } from '../../utils/test-uuid';
import { fetchAllProfilesByUserIdHandler } from './profiles-handlers';

export const fetchAllMemberTypesHandler = async (
  fastify: FastifyInstance
): Promise<MemberTypeEntity[]> => {
  return fastify.db.memberTypes.findMany();
};

export const fetchMemberTypesByIdHandler = async (
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

export const changeMemberTypesHandler = async (
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

export const fetchAllMemberTypesByUserIdHandler = async (
  fastify: FastifyInstance,
  args: { userId: string }
): Promise<MemberTypeEntity[]> => {
  if (isUUID(args.userId)) {
    try {
      const userProfiles = await fetchAllProfilesByUserIdHandler(fastify, {
        userId: args.userId,
      });
      if (!userProfiles) {
        return [];
      }
      const userMemberTypeIds = new Map();
      userProfiles.forEach((profile) => {
        userMemberTypeIds.set(profile.memberTypeId, profile.memberTypeId);
      });
      const resultMemberTypesPromises: Promise<MemberTypeEntity>[] = [];
      Array.from(userMemberTypeIds.keys()).forEach((key) => {
        const findOnePromise = fastify.db.memberTypes.findOne({
          key: 'id',
          equals: key,
        });
        if (findOnePromise) {
          resultMemberTypesPromises.push(
            findOnePromise as Promise<MemberTypeEntity>
          );
        }
      });
      return await Promise.all(resultMemberTypesPromises);
    } catch (e) {
      throw fastify.httpErrors.badRequest(
        'Error on fetchAllMemberTypesByUserIdHandler'
      );
    }
  }
  throw fastify.httpErrors.badRequest(
    'Wrong UUID on fetchAllMemberTypesByUserIdHandler'
  );
};
