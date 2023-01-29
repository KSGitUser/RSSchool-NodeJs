## Assignment: Graphql
### Tasks:
1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).  
   1.1. npm run test - 100%  
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
Constraints and logic for gql queries should be done based on restful implementation.  
For each subtask provide an example of POST body in the PR.  
All dynamic values should be sent via "variables" field.  
If the properties of the entity are not specified, then return the id of it.  
`userSubscribedTo` - these are users that the current user is following.  
`subscribedToUser` - these are users who are following the current user.  
   
   * Get gql requests:  
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.  
   2.2. Get user, profile, post, memberType by id - 4 operations in one query.  
   2.3. Get users with their posts, profiles, memberTypes.  
   2.4. Get user by id with his posts, profile, memberType.  
   2.5. Get users with their `userSubscribedTo`, profile.  
   2.6. Get user by id with his `subscribedToUser`, posts.  
   2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).  
   * Create gql requests:   
   2.8. Create user.  
   2.9. Create profile.  
   2.10. Create post.  
   2.11. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  
   * Update gql requests:  
   2.12. Update user.  
   2.13. Update profile.  
   2.14. Update post.  
   2.15. Update memberType.  
   2.16. Subscribe to; unsubscribe from.  
   2.17. [InputObjectType](https://graphql.org/graphql-js/type/#graphqlinputobjecttype) for DTOs.  

3. Solve `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.  
   You can use only one "findMany" call per loader to consider this task completed.  
   It's ok to leave the use of the dataloader even if only one entity was requested. But additionally (no extra score) you can optimize the behavior for such cases => +1 db call is allowed per loader.  
   3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).  
4. Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.   
   4.1. Provide a link to the line of code where it was used.  
   4.2. Specify a POST body of gql query that ends with an error due to the operation of the rule. Request result should be with `errors` field (and with or without `data:null`) describing the error.  

### Description:  
All dependencies to complete this task are already installed.  
You are free to install new dependencies as long as you use them.  
App template was made with fastify, but you don't need to know much about fastify to get the tasks done.  
All templates for restful endpoints are placed, just fill in the logic for each of them.  
Use the "db" property of the "fastify" object as a database access methods ("db" is an instance of the DB class => ./src/utils/DB/DB.ts).  
Body, params have fixed structure for each restful endpoint due to jsonSchema (schema.ts files near index.ts).  

### Description for the 1 task:
If the requested entity is missing - send 404 http code.  
If operation cannot be performed because of the client input - send 400 http code.  
You can use methods of "reply" to set http code or throw an [http error](https://github.com/fastify/fastify-sensible#fastifyhttperrors).  
If operation is successfully completed, then return an entity or array of entities from http handler (fastify will stringify object/array and will send it).  

Relation fields are only stored in dependent/child entities. E.g. profile stores "userId" field.  
You are also responsible for verifying that the relations are real. E.g. "userId" belongs to the real user.  
So when you delete dependent entity, you automatically delete relations with its parents.  
But when you delete parent entity, you need to delete relations from child entities yourself to keep the data relevant.   
(In the next rss-school task, you will use a full-fledged database that also can automatically remove child entities when the parent is deleted, verify keys ownership and instead of arrays for storing keys, you will use additional "join" tables)  

To determine that all your restful logic works correctly => run the script "npm run test".  
But be careful because these tests are integration (E.g. to test "delete" logic => it creates the entity via a "create" endpoint).  

### Description for the 2 task:  
You are free to create your own gql environment as long as you use predefined graphql endpoint (./src/routes/graphql/index.ts).  
(or stick to the [default code-first](https://github.dev/graphql/graphql-js/blob/ffa18e9de0ae630d7e5f264f72c94d497c70016b/src/__tests__/starWarsSchema.ts))  

### Description for the 3 task:
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  

### Description for the 4 task:  
If you have chosen a non-default gql environment, then the connection of some functionality may differ, be sure to report this in the PR.  
Limit the complexity of the graphql queries by their depth with "graphql-depth-limit" package.  
E.g. User can refer to other users via properties `userSubscribedTo`, `subscribedToUser` and users within them can also have `userSubscribedTo`, `subscribedToUser` and so on.  
Your task is to add a new rule (created by "graphql-depth-limit") in [validation](https://graphql.org/graphql-js/validation/) to limit such nesting to (for example) 6 levels max.


## Request examples:

You should send a post request on dress `http://127.0.0.1:3000/graphql`
All examples in GraphQl format of request. If You would like to send them line a body, you should change in to valid JSON

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
2.17. InputObjectType for DTOs.

