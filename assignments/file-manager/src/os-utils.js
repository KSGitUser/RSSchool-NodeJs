import os from "node:os";


const osFunctions = {
    '--EOL': () =>JSON.stringify(os.EOL),
    '--cpus': () => os.cpus(),
    '--homedir': () => os.homedir(),
    '--username': () => os.userInfo()?.username,
    '--architecture':()=>os.arch(),
}

export const getOsFunction = (commandName) => {
    try {
        console.log(osFunctions[commandName]());
    } catch (err) {
        throw new Error('No such os command')
    }
}


