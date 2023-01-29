import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql/type';
import { graphql } from 'graphql/graphql';
import {
  createPostHandler,
  fetchAllPostsHandler,
} from '../Handlers/posts-handlers';
import { postType, profileType, userType } from './graphql-types';
import {
  changeUserHandler,
  fetchAllUsersHandler,
  fetchUserByIdHandler,
  postUserHandler,
  userSubscribeToHandler,
} from '../Handlers/users-handlers';
import { createProfileHandler } from '../Handlers/profiles-handlers';

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
          createUser: {
            type: userType!,
            args: {
              firstName: {
                type: new GraphQLNonNull(GraphQLString)!,
                description: 'The firstName of the user.',
              },
              lastName: {
                type: new GraphQLNonNull(GraphQLString)!,
                description: 'The lastName of the user.',
              },
              email: {
                type: new GraphQLNonNull(GraphQLString)!,
                description: 'The email of the user.',
              },
            },
            resolve: (root, args) => postUserHandler(fastify, args),
          },
          createProfile: {
            type: profileType!,
            args: {
              avatar: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Avatar in the profile.',
              },
              sex: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Sex in the profile.',
              },
              birthday: {
                type: new GraphQLNonNull(GraphQLInt),
                description: 'Birthday in the profile.',
              },
              country: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Country in the profile.',
              },
              street: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'Street in the profile.',
              },
              city: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'City in the profile.',
              },
              memberTypeId: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'MemberTypeId in the profile.',
              },
              userId: {
                type: new GraphQLNonNull(GraphQLString),
                description: 'UserId in the profile.',
              },
            },
            resolve: (root, args) =>
              createProfileHandler(fastify, { body: args }),
          },
          createPost: {
            type: postType!,
            args: {
              title: {
                type: GraphQLString,
                description: 'The title of the post.',
              },
              content: {
                type: GraphQLString,
                description: 'The title of the post.',
              },
              userId: {
                type: GraphQLString,
                description: 'The userId of the post.',
              },
            },
            resolve: (root, args) => createPostHandler(fastify, { body: args }),
          },
          updateUser: {
            type: userType!,
            args: {
              id: {
                type: new GraphQLNonNull(GraphQLString)!,
                description: 'The user id.',
              },
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
            resolve: (root, args) =>
              changeUserHandler(fastify, {
                id: args.id,
                fieldsToChange: {
                  firstName: args.firstName,
                  lastName: args.lastName,
                  email: args.email,
                },
              }),
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
