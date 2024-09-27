## ENVIRONMENT:

To run app you should use node >= 18.12
To check your version run:

```
node -version
```

## FIRST RUN

During running code app use ports from `.env` file it will be created automatically when you run any script from
`package.json`. It will be created from file `.env.example` If you would like to change ports change them 
before running scripts in the `.env.example` file.

Run command

```
npm install
```

## To run in development mode

Run command:

```
npm run start:dev
```

## To run in production

Run command:

```
npm run start:prod
```

By default it will start main server on port 3000

## Test CRUD API

Tests run server so any server witch is running and using port from `.env` should be stopped before run tests.

To run tests, run command:

```
npm run test
```

## To run a load balancer with cluster

Run command:

```
npm run start:multi
```
By default, it will start main server on port 4000 and other servers on 4001, 4002 ... numOfCpus-1 

## Send requests

To send a request you can use Postman https://www.postman.com/
Or you can use `crul` command from cli (see examples)

Be sure you started server.

#### Examples
1. Get all users
```shell
curl --location --request GET 'http://localhost:3000/api/users'
```

2. CREATE User
```shell
curl --location --request POST 'http://localhost:3000/api/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "John",
    "age": 34,
    "hobbies": [
        "ski"
    ]
}'
```

3. READ user. You should use created user id:

```shell
curl --location --request GET 'http://localhost:3000/api/users/472373be-4cce-47f5-994e-3e6db0383352'
```

4. UPDATE user. You should use created user id:

```shell
curl --location --request PUT 'http://localhost:3000/api/users/267defc3-e4c6-4667-9008-2239b4ad8708' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "267defc3-e4c6-4667-9008-2239b4ad8708",
    "age": 21
}'
```
5. DELETE User. You should use created user id:

```shell
curl --location --request DELETE 'http://localhost:3000/api/users/267defc3-e4c6-4667-9008-2239b4ad8708'
```

## Contacts 
On any questions you can contact me using Discord
`SergeyK(KSGitUser)#8867`
