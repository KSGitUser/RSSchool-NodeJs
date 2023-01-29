import {
  ChangePostDTO,
  CreatePostDTO,
  PostEntity,
} from '../../utils/DB/entities/DBPosts';
import type { FastifyInstance } from 'fastify';
import { isUUID } from '../../utils/test-uuid';
import { fetchUserByIdHandler } from './users-handlers';

export const fetchAllPostsHandler = async (
  fastifyInstance: FastifyInstance
): Promise<PostEntity[]> => {
  try {
    return await fastifyInstance.db.posts.findMany();
  } catch (e) {
    throw fastifyInstance.httpErrors.badRequest(
      'Bad request on findMany posts'
    );
  }
};

export const fetchPostByIdHandler = async (
  fastify: FastifyInstance,
  args: { id: string }
): Promise<PostEntity> => {
  if (isUUID(args.id)) {
    const foundedPost = await fastify.db.posts.findOne({
      key: 'id',
      equals: args.id,
    });
    if (!foundedPost) {
      throw fastify.httpErrors.notFound('No post');
    }
    return foundedPost;
  }
  throw fastify.httpErrors.notFound('Wrong post uuid in get');
};

export const createPostHandler = async (
  fastify: FastifyInstance,
  args: { body: CreatePostDTO }
): Promise<PostEntity> => {
  try {
    const foundedUser = await fetchUserByIdHandler(fastify, {
      id: args.body.userId,
    });
    if (!foundedUser) {
      throw fastify.httpErrors.notFound('Wrong user id');
    }
    return await fastify.db.posts.create(args.body);
  } catch (e: any) {
    throw fastify.httpErrors.badRequest(
      e.message || 'Bad request on post posts'
    );
  }
};

export const deletePostHandler = async (
  fastify: FastifyInstance,
  args: { id: string }
): Promise<PostEntity> => {
  if (isUUID(args.id)) {
    try {
      return await fastify.db.posts.delete(args.id);
    } catch (e) {
      throw fastify.httpErrors.badRequest('Error on posts delete');
    }
  }
  throw fastify.httpErrors.badRequest('Wrong UUID on posts delete');
};

export const changePostHandler = async (
  fastify: FastifyInstance,
  args: { id: string; body: ChangePostDTO }
): Promise<PostEntity> => {
  if (isUUID(args.id)) {
    try {
      await fetchPostByIdHandler(fastify, { id: args.id });
      return await fastify.db.posts.change(args.id, args.body);
    } catch (e) {
      throw fastify.httpErrors.badRequest('Error on posts patch');
    }
  }
  throw fastify.httpErrors.badRequest('Wrong UUID on posts patch');
};
