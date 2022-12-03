'use strict';
import { argv, env } from "node:process"

export const argvMap = new Map()

export const parseArgs = () => {
    const [, , ...argvs] = argv;
    let i = 0;

    while (i < argvs.length) {
        if (argvs[i].startsWith("--")) {
            if (argvs[i].includes('=')) {
                const [argvKey, argvValue] = argvs[i].split('=')
                argvMap.set(argvKey.substring(2), argvValue)
            } else if (argvs[i].substring(2)) {
                argvMap.set(argvs[i].substring(2), true)
            }
        }
        i += 1
    }
    return argvMap;
};
