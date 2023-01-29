import { FastifyInstance } from 'fastify';
import {
  ChangeProfileDTO,
  CreateProfileDTO,
  ProfileEntity,
} from '../../utils/DB/entities/DBProfiles';
import { isUUID } from '../../utils/test-uuid';

export const fetchAllProfileHandler = async (
  fastify: FastifyInstance
): Promise<ProfileEntity[]> => {
  try {
    return await fastify.db.profiles.findMany();
  } catch (e) {
    throw fastify.httpErrors.badRequest('No memberTypeId');
  }
};

export const fetchProfileByIdHandler = async (
  fastify: FastifyInstance,
  args: { id: string }
): Promise<ProfileEntity> => {
  if (isUUID(args.id)) {
    const fountUser = await fastify.db.profiles.findOne({
      key: 'id',
      equals: args.id,
    });
    if (fountUser) {
      return fountUser;
    }
    throw fastify.httpErrors.notFound('No profile with such id');
  }
  throw fastify.httpErrors.notFound('Wrong profile UUID');
};

export const createProfileHandler = async (
  fastify: FastifyInstance,
  args: { body: CreateProfileDTO }
): Promise<ProfileEntity> => {
  const [isExistUser, isProfileForUserExist] = await Promise.all([
    await fastify.db.users.findOne({
      key: 'id',
      equals: args.body.userId,
    }),
    await fastify.db.profiles.findOne({
      key: 'userId',
      equals: args.body.userId,
    }),
  ]);
  if (!isExistUser) {
    throw fastify.httpErrors.badRequest('User for profile do not exist');
  }
  if (isProfileForUserExist) {
    throw fastify.httpErrors.badRequest('Profile for this user exist');
  }
  const createdProfile = await fastify.db.profiles.create(args.body);
  if (
    createdProfile &&
    createdProfile?.memberTypeId === args.body.memberTypeId &&
    (args.body.memberTypeId === 'basic' ||
      args.body.memberTypeId === 'business')
  ) {
    return createdProfile;
  } else {
    throw fastify.httpErrors.badRequest('No member Type Id');
  }
};

export const deleteProfileHandler = async (
  fastify: FastifyInstance,
  args: { id: string }
): Promise<ProfileEntity> => {
  if (isUUID(args.id)) {
    const deletedProfile = await fastify.db.profiles.delete(args.id);
    if (!deletedProfile) {
      throw fastify.httpErrors.badRequest('Wrong profile Id');
    }
    return deletedProfile;
  }
  throw fastify.httpErrors.badRequest('Wrong profile Id');
};

export const changeProfileHandler = async (
  fastify: FastifyInstance,
  args: { id: string; body: ChangeProfileDTO }
): Promise<ProfileEntity> => {
  if (isUUID(args.id)) {
    try {
      await fetchProfileByIdHandler(fastify, { id: args.id });
      const result = await fastify.db.profiles.change(args.id, {
        ...args.body,
      });
      if (!result) {
        throw fastify.httpErrors.notFound('Not found profile');
      }
      return result;
    } catch (e: any) {
      throw fastify.httpErrors.notFound(e.message || 'No profile');
    }
  }
  throw fastify.httpErrors.badRequest('No valid profile Id');
};
