import { parseArgs } from './src/cli.js'
import repl from 'node:repl'
import process from 'node:process'
import os from 'node:os'
import util from 'node:util'



const argvs = parseArgs()
const username = argvs.get('username')
const greeting = `Welcome to the File Manager, ${username}!`
const goodbye = `Thank you for using File Manager, \x1b[31m${username}\x1b[0m, goodbye!`
process.chdir(os.homedir())
const prompt = () => `You are currently in ${process.cwd()}`
const replWriter = (output) => {
    return `${prompt()}\n${output}`
}

console.log(prompt())
const replInstance = repl.start({ prompt: '> ', writer: replWriter})

replInstance.on('exit', () => {
    console.log(goodbye)
    process.exit(0);
})

replInstance.on('error', (err) => {
    console.log('My error');
})

