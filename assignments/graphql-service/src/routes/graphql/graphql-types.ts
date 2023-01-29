import {
  GraphQLEnumType,
  GraphQLInt,
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

export type ProfileEntity = {
  id: string;
  avatar: string;
  sex: string;
  birthday: number;
  country: string;
  street: string;
  city: string;
  memberTypeId: string;
  userId: string;
};

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
