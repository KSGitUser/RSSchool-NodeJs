import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';

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
      type: GraphQLString,
      description: 'The userId of the post.',
      resolve: (root) => {
        return root.userId;
      },
    },
  }),
});

export const userType = new GraphQLObjectType({
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
      type: GraphQLString,
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
      type: GraphQLString,
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
  }),
});
