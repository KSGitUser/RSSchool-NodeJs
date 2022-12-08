import { parseArgs } from './src/cli.js'
import process from 'node:process'
import os from 'node:os'
import {cd, ls, up} from "./src/file-system.js"
import * as readline from 'node:readline/promises';
import {add, cat, cp, rn, rm, mv} from "./src/file-base-operations.js";
import {getOsFunction} from "./src/os-utils.js";

const COMMANDS = {
    up: up,
    cd: cd,
    ls: ls,
    cat: cat,
    add: add,
    rn: rn,
    cp: cp,
    rm: rm,
    mv: mv,
    os: getOsFunction,
}

const argvs = parseArgs()
const username = argvs.get('username') || 'John Doe'
const greeting = `Welcome to the File Manager, ${username}!`
const goodbye = `Thank you for using File Manager, \x1b[31m${username}\x1b[0m, goodbye!`
process.chdir(os.homedir());
const rl = readline.createInterface({ input: process.stdin, output:process.stdout });
const prompt = () => `You are currently in ${process.cwd()}\n> `

rl.setPrompt(prompt())
console.log(greeting)
rl.prompt()


rl.on('close', () => {
    console.log(`\n${goodbye}`)
    process.exit(0);
})

rl.on('line', async (lineData) => {
    try {
        const [command, ...arg ] = lineData.split(' ')
        // eslint-disable-next-line no-console
        console.log('arg =>', ...arg);
        if (COMMANDS[command]) {
            await COMMANDS[command](...arg);
        } else {
            console.log(`\x1b[31m${'Invalid input'}\x1b[0m`)
        }
    } catch (err) {
        if (err.code) {
            console.log(err.message);
        } else {
            console.log(err);
        }
    }
    rl.setPrompt(prompt())
    rl.prompt()
})

process.stdout.on('error', (err) => {
    console.log('My error');
})

