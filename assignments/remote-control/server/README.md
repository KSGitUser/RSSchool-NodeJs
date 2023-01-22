## Connections using sockets 

Create connections using `ws`  and `nut.js` libraries

### Environment

You should use node with version >= 18.12, to check run:

```shell
node --version
```

### Installation
Clone/download repo (command bellow clone `task-4/remote-control` branch  of repo):
   ```shell
   git clone --branch task-4/remote-control --single-branch https://github.com/KSGitUser/RSSchool-nodejs.git
   ```
   
   It's a part of a big project. Go to the folder `assignments/remote-control/server`

   ```shell
   cd RSSchool-nodejs/assignments/remote-control/server
   ```
Install dependencies on client and server by one command:

`npm run install-dep`

### Start server
To start in dev mode run a command

```shell
npm run start:dev
```

To start in production mode:
```shell
npm run start:prod
```
It will start server on http://localhost:8080

### Start client
Client is in folder `assignments/remote-control/r-control`. You can start it from server directory:

```shell
npm run start:client
```
It will start on address http://localhost:8181
Open in browser
