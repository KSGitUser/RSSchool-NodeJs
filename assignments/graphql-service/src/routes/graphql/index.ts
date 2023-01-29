import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
// import { buildSchema } from 'graphql/utilities';
// import { graphql } from 'graphql/graphql';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/type';
import { graphql } from 'graphql/graphql';
import { fetchAllPostsHandler } from '../Handlers/posts-handlers';
import { postType, userType } from './graphql-types';
import {
  fetchAllUsersHandler,
  fetchUserByIdHandler,
  postUserHandler,
  userSubscribeToHandler,
} from '../Handlers/users-handlers';

// const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
//   fastify
// ): Promise<void> => {
//   fastify.post(
//     '/',
//     {
//       schema: {
//         body: graphqlBodySchema,
//       },
//     },
//     async function (request, reply) {
//       // Construct a schema, using GraphQL schema language
//       var schemaHello = buildSchema(`
//       type Query {
//         hello: String
//       }
//        `);
//
//       const schemaBuy = buildSchema(`
//       type Query {
//          buy: String
//       }`);
//
//       // The rootValue provides a resolver function for each API endpoint
//       var rootValue = {
//         hello: () => {
//           return 'Hello world!';
//         },
//         buy: () => {
//           return 'Buy world!';
//         },
//       };
//       let response;
//
//       // Run the GraphQL query '{ hello }' and print out the response
//       response = await graphql({
//         schema: schemaHello,
//         source: '{ hello }',
//         rootValue,
//       });
//
//       response = await graphql({
//         schema: schemaBuy,
//         source: '{ buy }',
//         rootValue,
//       });
//
//       console.log('response =>', response);
//       return response;
//     }
//   );
// };

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const queryType = new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
          allPosts: {
            type: new GraphQLList(postType),
            args: {},
            resolve: (root, args) => fetchAllPostsHandler(fastify),
          },
          allUsers: {
            type: new GraphQLList(userType),
            resolve: (root, args) => fetchAllUsersHandler(fastify),
          },
          getUserById: {
            type: userType,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'User UUID',
              },
            },
            resolve: (root, args) => fetchUserByIdHandler(fastify, args),
          },
        }),
      });

      const mutationType = new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
          postUser: {
            type: userType!,
            args: {
              firstName: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The firstName of the user.',
              },
              lastName: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The lastName of the user.',
              },
              email: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'The email of the user.',
              },
            },
            resolve: (root, args) => postUserHandler(fastify, args),
          },
          userSubscribeTo: {
            type: userType,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'User Id to whom is subscribing',
              },
              userId: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'User Id who is subscribing',
              },
            },
            resolve: (root, args) => userSubscribeToHandler(fastify, args),
          },
        }),
      });

      const StarWarsSchema: GraphQLSchema = new GraphQLSchema({
        query: queryType,
        mutation: mutationType,
        types: [postType],
      });

      // const source = `
      //   query HeroNameQuery {
      //     hero { name }
      //   }
      // `;

      // eslint-disable-next-line no-console
      console.log('request.body.query =>', request.body.query);
      const response = await graphql({
        schema: StarWarsSchema,
        source: String(request.body.query),
      });
      // eslint-disable-next-line no-console
      console.log('response =>', response);
      reply.send(response);
    }
  );
};

export default plugin;
