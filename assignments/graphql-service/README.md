## Assignment: Graphql

It's a part of repository:

Clone branch:
```shell
   git clone --branch task-5/graphql-basic --single-branch https://github.com/KSGitUser/RSSchool-nodejs.git
```

Go to the directory of graphql-basic

```shell
cd RSSchool-nodejs/assignments/graphql-service
```

install dependencies

```shell
npm install
```

### Run test 

Run tests

```shell
npm run test
```

### Request examples:

Run server 
```shell
npm run dev
```

You should send a post request on dress `http://127.0.0.1:3000/graphql`
All examples in GraphQl format of request. If You would like to send them line a body, you should change in to valid JSON

###  Get gql requests:
2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.
```
query {
   allUsers {
        id
        firstName
        lastName
        email
        subscribedToUserIds
   }
   allProfiles {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
        }
   allPosts {
       id
       id
       content
       userId
   }
   allMemberTypes {
       id
       discount
       monthPostsLimit
   }
}
```
2.2. Get user, profile, post, memberType by id - 4 operations in one query.
You should add existing ids
```
query {
   getUserById (id: "bd979fea-8781-49e7-bf68-b9b92501be53"){
        id
        firstName
        lastName
        email
        subscribedToUserIds
   }
   getProfileById (id: "177d1f47-9c98-482a-b9c9-9fedeee560c0") {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
        }
   getPostById(id: "b31e87cc-dab6-4747-968d-39b0ad7f389c") {
       id
       id
       content
       userId
   }
   getMemberTypeById (id: "basic") {
       id
       discount
       monthPostsLimit
   }
}
```
2.3. Get users with their posts, profiles, memberTypes.
```
query {
   allUsers {
        id
        firstName
        lastName
        email
        subscribedToUserIds
        userPosts {
            id
            content
            userId
        },
        userProfiles {
            id
            avatar
            sex
            birthday
            country
            street
            city
            memberTypeId
            userId
        }
        userMemberTypes {
            id
            discount
            monthPostsLimit
        }
   }
}
```
2.4. Get user by id with his posts, profile, memberType.
You should provide user Id
```
query {
   getUserById (id: "973ab978-ca87-471d-9ade-f661416d8e3e"){
        id
        firstName
        lastName
        email
        subscribedToUserIds
         userPosts {
            id
            content
            userId
        },
        userProfiles {
            id
            avatar
            sex
            birthday
            country
            street
            city
            memberTypeId
            userId
        }
        userMemberTypes {
            id
            discount
            monthPostsLimit
        },
   }
}
```
2.5. Get users with their userSubscribedTo, profile.
```
query {
   allUsers {
        id
        firstName
        lastName
        email
        subscribedToUserIds
        usersSubscribedTo {
            id
            firstName
            lastName
            email
            userProfiles {
                id
                avatar
                sex
                birthday
                country
                street
                city
                memberTypeId
                userId
            }
        }
   }
}
```
2.6. Get user by id with his subscribedToUser, posts.
```
query getAllInstances {
    getUserById (id: "0e91fd9a-515a-4d3d-9b37-c593e96c243b") {
         id
        firstName
        lastName
        email
        subscribedToUserIds
        subscribedToUser {
            id
            firstName
            lastName
            email
            userPosts {
                id
            }
        }
    }
}
```
response example
```
{
    "data": {
        "getUserById": {
            "id": "0e91fd9a-515a-4d3d-9b37-c593e96c243b",
            "firstName": "Mike",
            "lastName": "Malkovich",
            "email": "john@malkovich.com",
            "subscribedToUserIds": [
                "fbec5f38-4e4c-441a-a166-75c67fa6dcc6"
            ],
            "subscribedToUser": [
                {
                    "id": "fbec5f38-4e4c-441a-a166-75c67fa6dcc6",
                    "firstName": "Mike",
                    "lastName": "Malkovich",
                    "email": "john@malkovich.com",
                    "userPosts": [
                        {
                            "id": "a0a3c92a-e094-4653-9f7a-0653c5c4478e"
                        },
                        {
                            "id": "f7704afc-0898-41ac-945f-83e34a3ff60a"
                        }
                    ]
                }
            ]
        }
    }
}
```
2.7. Get users with their userSubscribedTo, subscribedToUser 
(additionally for each user in userSubscribedTo, subscribedToUser add their userSubscribedTo, 
subscribedToUser).
```
query {
  allUsers {
        id
        firstName
        lastName
        email
        subscribedToUserIds
        usersSubscribedTo {
            id
            firstName
            lastName
            usersSubscribedTo {
                id
                firstName
                lastName
            }
            subscribedToUser {
                id
                firstName
                lastName
            }
        }
        subscribedToUser {
            id
            firstName
            lastName
            email
            usersSubscribedTo {
                id
                firstName
                lastName
            }
            subscribedToUser {
                id
                firstName
                lastName
            }
        }
    }
}
```
response example
```JSON
{
    "data": {
        "allUsers": [
            {
                "id": "c9753328-96a3-48d2-b81b-21e8b6a50f7d",
                "firstName": "Mike",
                "lastName": "Malkovich",
                "email": "john@malkovich.com",
                "subscribedToUserIds": [],
                "usersSubscribedTo": [
                    {
                        "id": "28e9ded5-6892-4093-99e6-0f48ed540ecd",
                        "firstName": "John",
                        "lastName": "Malkovich",
                        "usersSubscribedTo": [],
                        "subscribedToUser": [
                            {
                                "id": "c9753328-96a3-48d2-b81b-21e8b6a50f7d",
                                "firstName": "Mike",
                                "lastName": "Malkovich"
                            }
                        ]
                    }
                ],
                "subscribedToUser": []
            },
            {
                "id": "28e9ded5-6892-4093-99e6-0f48ed540ecd",
                "firstName": "John",
                "lastName": "Malkovich",
                "email": "john@malkovich.com",
                "subscribedToUserIds": [
                    "c9753328-96a3-48d2-b81b-21e8b6a50f7d"
                ],
                "usersSubscribedTo": [],
                "subscribedToUser": [
                    {
                        "id": "c9753328-96a3-48d2-b81b-21e8b6a50f7d",
                        "firstName": "Mike",
                        "lastName": "Malkovich",
                        "email": "john@malkovich.com",
                        "usersSubscribedTo": [
                            {
                                "id": "28e9ded5-6892-4093-99e6-0f48ed540ecd",
                                "firstName": "John",
                                "lastName": "Malkovich"
                            }
                        ],
                        "subscribedToUser": []
                    }
                ]
            }
        ]
    }
}
```

###  Create gql requests:
2.8. Create user. 
```
mutation {
   createUser(firstName: "John", lastName: "Malkovich", email: "john@malkovich.com") {
       id
       firstName 
       lastName
          email
        subscribedToUserIds
     }
}
```

2.9. Create profile.  

In field userId you should type id of existing user. 

```
mutation {
    createProfile(
     avatar: "avatar",
     sex: "male",
     birthday: 10101990,
     country: "USA",
     street: "Fifth Avenue",
     city: "New York",
     memberTypeId: "basic",
     userId: "8e5172f4-a23c-4171-8b42-a76db540710b"
    ) {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
    }
}
```
2.10. Create post.  
In field userId you should type id of existing user.
```
mutation {
    createPost(
        title: "GraphQl example",
        content: "Post about GraphQl",
        userId: "1913fbf6-9527-41bc-a471-2b9d8867981e"
        ) {
            id
            title
            content
            userId
        }
}
```
2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.
All fields have type definition and description
### Update gql requests:
2.12. Update user.
In id should be existing user id
```
mutation {
   updateUser(
       id: "5dfe436f-5729-489d-946f-3a12f7b4bf40",
       firstName: "Mike", 
       lastName: "Malkovich", 
       email: "mike@malkovich.com") {
        id
        firstName 
        lastName
        email
        subscribedToUserIds
     }
}
```
2.13. Update profile.
You should provide existing profile id
```
mutation {
    updateProfile(
        id: "eaed59ee-682d-468f-8955-b7d818dcc8be",
        avatar: "avatar",
        sex: "male",
        birthday: 10101990,
        country: "USA",
        street: "Fifth Avenue",
        city: "New York",
        memberTypeId: "basic",
    ) {
        id
        avatar
        sex
        birthday
        country
        street
        city
        memberTypeId
        userId
    }
}
```
2.14. Update post.
You should provide existing post id
```
mutation {
    updatePost (
        id: "609c3a6f-a30d-41e3-bbad-46164d8c8e8c",
        title: "New title",
        content: "Updated content"
    ) {
        id
        title
        content
        userId
    }
}
```
2.15. Update memberType.
Id of Member Type can be "basic" of "business"
```
mutation {
    updateMemberType (
        id: "basic",
        discount: 1,
        monthPostsLimit: 10
    ) {
        id
        discount
        monthPostsLimit
    }
}
```
2.16. Subscribe to; unsubscribe from.
```
mutation {
    userSubscribeTo (
        subscribeToUserId: "70c8ee33-034a-4b55-b774-a3a589c0bf62",
        subscriberUserId: "98af25ac-12e1-45ac-bee9-5fde3e977890"
    ) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
    }
}
```
unsubscribe from.
```
mutation {
    userUnsubscribeFrom (
        unsubscribeFromUserId: "70c8ee33-034a-4b55-b774-a3a589c0bf62",
        unsubscriberUserId: "98af25ac-12e1-45ac-bee9-5fde3e977890"
    ) {
        id
        firstName
        lastName
        email
        subscribedToUserIds
    }
}
```

2.17. InputObjectType for DTOs.
All fields has DTO


### 3. Solve n+1 graphql problem with dataloader package in all places where it should be used.

Add dataLoaders

```
      subscribedToUser: {
        type: new GraphQLList(userType),
        description: 'List of subscribed to users with full data',
        resolve: (root, args, context) => {
          // add data loader
          const users = root.subscribedToUserIds.map((userId) => {
            return context.usersLoader.load(userId);
          });
          return users;
          // return subscribedToUserHandler(context.fastify, {
          //   subscribedIds: root.subscribedToUserIds,
          // });
        },
      },
```

```
    getUserById: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'User UUID',
        },
      },
      // resolve: (root, args) => fetchUserByIdHandler(fastify, args),
      resolve: (root, args, context) => {
        // add data load
        return context.usersLoader.load(args.id);
      },
    },
```

## 4 Limit the complexity of the graphql queries by their depth with graphql-depth-limit package.

Code is here:
assignments/graphql-service/src/routes/graphql/index.ts

```javascript
      const source = new Source(String(request.body.query));
      const ast = parse(source);

      let validationsResult = validate(graphQLSchema, ast, [depthLimit(2)]);
      if (validationsResult.length) {
        const errorMessage = validationsResult[0].message;
        validationsResult = [];
        throw fastify.httpErrors.badRequest(errorMessage);
      }
```
Request
```javascript
query {
  allUsers {
        id
        firstName
        lastName
        email
        subscribedToUserIds
        usersSubscribedTo {
            id
            usersSubscribedTo {
                id
                usersSubscribedTo {
                    id
                    usersSubscribedTo {
                        id
                        usersSubscribedTo {
                            id
                            usersSubscribedTo {
                                id
                                usersSubscribedTo {
                                    id
                                    usersSubscribedTo {
                                        id
                                
                                    }
                                }
                            }    
                        }                
                    }
                }
            }
        }
    }
}
```

Response 
```javascript
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "'' exceeds maximum operation depth of 6"
}
```



