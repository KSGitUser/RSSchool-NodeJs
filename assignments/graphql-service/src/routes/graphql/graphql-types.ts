import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';
import { fetchAllPostsByUserId } from '../Handlers/posts-handlers';
import { fetchAllProfilesByUserIdHandler } from '../Handlers/profiles-handlers';
import { fetchAllMemberTypesByUserIdHandler } from '../Handlers/member-types-handlers';
import {
  usersSubscribedToHandler,
  subscribedToUserHandler,
} from '../Handlers/users-handlers';
import { FastifyInstance } from 'fastify';

export const postType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post type',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of post.',
      resolve: (root) => {
        return root.id;
      },
    },
    title: {
      type: GraphQLString,
      description: 'The title of the post.',
      resolve: (root) => {
        return root.title;
      },
    },
    content: {
      type: GraphQLString,
      description: 'The title of the post.',
      resolve: (root) => {
        return root.content;
      },
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The userId of the post.',
      resolve: (root) => {
        return root.userId;
      },
    },
  }),
});

type TUserTypeTSource = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subscribedToUserIds: string[];
  userPosts: typeof postType;
  userProfiles: typeof profileType;
  userMemberTypes: typeof memberTypeType;
  usersSubscribedTo: TUserTypeTSource[];
  subscribedToUser: TUserTypeTSource[];
};

type TUserTypeTContext = {
  fastify: FastifyInstance;
};

export const userType: GraphQLObjectType<TUserTypeTSource, TUserTypeTContext> =
  new GraphQLObjectType({
    name: 'User',
    description: 'User type',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The id of user.',
        resolve: (root) => {
          return root.id;
        },
      },
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The firstName of the user.',
        resolve: (root) => {
          return root.firstName;
        },
      },
      lastName: {
        type: GraphQLString,
        description: 'The lastName of the user.',
        resolve: (root) => {
          return root.lastName;
        },
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The email of the user.',
        resolve: (root) => {
          return root.email;
        },
      },
      subscribedToUserIds: {
        type: new GraphQLList(GraphQLString),
        resolve: (root) => {
          return root.subscribedToUserIds;
        },
      },
      userPosts: {
        type: new GraphQLList(postType),
        resolve: (root, args, context) => {
          return fetchAllPostsByUserId(context.fastify, { userId: root.id });
        },
      },
      userProfiles: {
        type: new GraphQLList(profileType),
        resolve: (root, args, context) => {
          return fetchAllProfilesByUserIdHandler(context.fastify, {
            userId: root.id,
          });
        },
      },
      userMemberTypes: {
        type: new GraphQLList(memberTypeType),
        resolve: (root, args, context) => {
          return fetchAllMemberTypesByUserIdHandler(context.fastify, {
            userId: root.id,
          });
        },
      },
      usersSubscribedTo: {
        type: new GraphQLList(userType),
        description: 'List of subscribed to users with full data',
        resolve: (root, args, context) => {
          return usersSubscribedToHandler(context.fastify, {
            id: root.id,
          });
        },
      },
      subscribedToUser: {
        type: new GraphQLList(userType),
        description: 'List of subscribed to users with full data',
        resolve: (root, args, context) => {
          return subscribedToUserHandler(context.fastify, {
            subscribedIds: root.subscribedToUserIds,
          });
        },
      },
    }),
  });

export const memberTypesEnum = new GraphQLEnumType({
  name: 'MemberTypes',
  description: 'Type of Member Types',
  values: {
    business: {
      value: 'business',
      description: 'Business member type',
    },
    basic: {
      value: 'basic',
      description: 'Basic member type',
    },
  },
});

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'Profile type',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of profile.',
    },
    avatar: {
      type: GraphQLString,
      description: 'The avatar of profile.',
    },
    sex: {
      type: GraphQLString,
      description: 'The sex of profile',
    },
    birthday: {
      type: GraphQLInt,
      description: 'The birthday of profile',
    },
    country: {
      type: GraphQLString,
      description: 'The country of profile',
    },
    street: {
      type: GraphQLString,
      description: 'The street of profile',
    },
    city: {
      type: GraphQLString,
      description: 'The city of profile',
    },
    memberTypeId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The memberTypeId of profile',
    },
    userId: {
      type: GraphQLString,
      description: 'The user Id of profile',
    },
  }),
});

export type MemberTypeEntity = {
  id: string;
  discount: number;
  monthPostsLimit: number;
};

export const memberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  description: 'Member Type',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)!,
      description: 'The id of Member Type',
    },
    discount: {
      type: GraphQLInt,
      description: 'The discount of of Member Type.',
    },
    monthPostsLimit: {
      type: GraphQLInt,
      description: 'Month post limits of Member Type',
    },
  }),
});

// export const allDBInstancesType = new GraphQLObjectType({
//   name: 'AllDBInstances',
//   description:  'Users, Posts, Profiles, MemberTypes',
//   fields: () => ({
//     allUsers: {
//       type: new GraphQLList(userType);
//       resolve: () =>
//     }
//   })
// })
