import { PostEntity } from '../../utils/DB/entities/DBPosts';
import type { FastifyInstance } from 'fastify';

export const fetchAllPosts = async (
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
