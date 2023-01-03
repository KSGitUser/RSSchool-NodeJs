import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 *
 * @param url - import.meta.url
 * @return {string} path to current directory
 */
export default (url) => dirname(fileURLToPath(url));
